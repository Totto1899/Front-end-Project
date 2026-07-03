/*1. BASE DE DATOS Y FUNCIONES GLOBALES*/
const catalogoPeliculas = [
  {
    id: 1,
    titulo: "Inglourious Basterds",
    genero: "Acción",
    precio: 3.99,
    imagen: "../img/inglouriousBasterds.jpg",
  },
  {
    id: 2,
    titulo: "Gladiador",
    genero: "Acción",
    precio: 3.5,
    imagen: "../img/Gladiator.jpg",
  },
  {
    id: 3,
    titulo: "Pulp Fiction",
    genero: "Acción",
    precio: 3.99,
    imagen: "../img/pulpFiction.jpg",
  },
  {
    id: 4,
    titulo: "Dune: Parte Dos",
    genero: "Ciencia Ficción",
    precio: 4.99,
    imagen: "../img/dune2.jpg",
  },
  {
    id: 5,
    titulo: "Parque Jurásico",
    genero: "Ciencia Ficción",
    precio: 2.99,
    imagen: "../img/jurassicPark.png",
  },
  {
    id: 6,
    titulo: "Pobres Criaturas",
    genero: "Comedia",
    precio: 4.0,
    imagen: "../img/poorThings.jpg",
  },
  {
    id: 7,
    titulo: "Oppenheimer",
    genero: "Drama",
    precio: 4.5,
    imagen: "../img/oppenheimer.jpg",
  },
  {
    id: 8,
    titulo: "El Renacido",
    genero: "Drama",
    precio: 3.5,
    imagen: "../img/theRevenant.jpg",
  },
];

// Función para actualizar el numerito del header
function actualizarContadorCarrito() {
  const contador = document.getElementById("contador-carrito");
  if (contador) {
    let carritoActual =
      JSON.parse(localStorage.getItem("carritoPeliClick")) || [];
    contador.textContent = carritoActual.length;
  }
}

function agregarAlCarrito(id) {
  const peliculaSeleccionada = catalogoPeliculas.find(
    (pelicula) => pelicula.id === id,
  );
  if (!peliculaSeleccionada) return; // Evita errores si el ID no existe

  let carritoActual =
    JSON.parse(localStorage.getItem("carritoPeliClick")) || [];
  const yaExiste = carritoActual.some((pelicula) => pelicula.id === id);

  if (yaExiste) {
    alert(
      `La película "${peliculaSeleccionada.titulo}" ya se encuentra en tu carrito.`,
    );
    return;
  }

  carritoActual.push(peliculaSeleccionada);
  localStorage.setItem("carritoPeliClick", JSON.stringify(carritoActual));
  actualizarContadorCarrito();

  alert(`¡"${peliculaSeleccionada.titulo}" se agregó a tu carrito con éxito!`);
}

/*2. LÓGICA DE INICIO DE SESIÓN*/
const formularioLogin = document.getElementById("login-form");

if (formularioLogin) {
  formularioLogin.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const inputEmail = document.getElementById("user-email").value.trim();
    const inputPassword = document.getElementById("user-password").value.trim();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (inputEmail === "" || inputPassword === "") {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }
    if (!regexEmail.test(inputEmail)) {
      alert(
        "Por favor, ingresa un correo electrónico válido (ejemplo: usuario@correo.com).",
      );
      return;
    }

    localStorage.setItem("usuarioActivo", inputEmail);
    alert(
      `¡Bienvenido a PeliClick, ${inputEmail}! Iniciaste sesión correctamente.`,
    );
    window.location.href = "../index.html";
  });
}

/*3. LÓGICA DEL CARRITO DE COMPRAS*/
const contenedorCarrito = document.querySelector(".cart-items");
const elementoTotal = document.querySelector(
  ".summary-row.total span:nth-child(2)",
);

if (contenedorCarrito) {
  let carrito = JSON.parse(localStorage.getItem("carritoPeliClick")) || [];

  function renderizarCarrito() {
    contenedorCarrito.innerHTML = "";
    let montoTotal = 0;

    if (carrito.length === 0) {
      contenedorCarrito.innerHTML =
        "<p>Tu carrito está vacío. ¡Ve a explorar nuestro catálogo!</p>";
      elementoTotal.textContent = "$0.00";
      return;
    }

    carrito.forEach((pelicula, indice) => {
      montoTotal += pelicula.precio;
      const articulo = document.createElement("article");
      articulo.classList.add("cart-item");
      articulo.innerHTML = `
        <img src="${pelicula.imagen}" alt="Póster de ${pelicula.titulo}">
        <div class="cart-item-details">
          <h4>${pelicula.titulo}</h4>
          <p>Alquiler 48hs</p>
        </div>
        <div class="cart-item-price">$${pelicula.precio.toFixed(2)}</div>
        <button class="btn-remove" data-index="${indice}">Eliminar</button>
      `;
      contenedorCarrito.appendChild(articulo);
    });

    elementoTotal.textContent = `$${montoTotal.toFixed(2)}`;

    const botonesEliminar = document.querySelectorAll(".btn-remove");
    botonesEliminar.forEach((boton) => {
      boton.addEventListener("click", function () {
        const indicePelicula = this.getAttribute("data-index");
        eliminarPelicula(indicePelicula);
      });
    });
  }

  function eliminarPelicula(indice) {
    carrito.splice(indice, 1);
    localStorage.setItem("carritoPeliClick", JSON.stringify(carrito));
    renderizarCarrito();
    actualizarContadorCarrito();
  }

  renderizarCarrito();

  const botonComprar = document.querySelector(".btn-checkout");
  if (botonComprar) {
    botonComprar.addEventListener("click", function () {
      if (carrito.length === 0) {
        alert(
          "Tu carrito está vacío. ¡Agrega algunas películas al catálogo primero!",
        );
        return;
      }
      alert(
        "¡Pago procesado con éxito! Preparando tus películas para la descarga...",
      );
      localStorage.removeItem("carritoPeliClick");
      carrito = [];
      renderizarCarrito();
      actualizarContadorCarrito();
    });
  }
}

/*4. LÓGICA DE CATEGORÍAS (FILTRO)*/
const contenedorCatalogo = document.querySelector(
  ".categories-content .movie-grid",
);
const enlacesGeneros = document.querySelectorAll(".genre-list a");

if (contenedorCatalogo && enlacesGeneros.length > 0) {
  function renderizarCatalogo(generoFiltro) {
    contenedorCatalogo.innerHTML = "";

    const peliculasFiltradas =
      generoFiltro === "Todos"
        ? catalogoPeliculas
        : catalogoPeliculas.filter(
            (pelicula) => pelicula.genero === generoFiltro,
          );

    if (peliculasFiltradas.length === 0) {
      contenedorCatalogo.innerHTML =
        "<p>Próximamente agregaremos películas a esta categoría.</p>";
      return;
    }

    peliculasFiltradas.forEach((pelicula) => {
      const articulo = document.createElement("article");
      articulo.classList.add("movie-card");
      articulo.innerHTML = `
        <img src="${pelicula.imagen}" alt="Póster de ${pelicula.titulo}">
        <div class="movie-info">
          <h3>${pelicula.titulo}</h3>
          <p>${pelicula.genero}</p>
          <p class="price">$${pelicula.precio.toFixed(2)}</p>
          <button class="btn-rent" data-id="${pelicula.id}">Alquilar</button>
        </div>
      `;
      contenedorCatalogo.appendChild(articulo);
    });

    const botonesAlquilar = document.querySelectorAll(
      ".categories-content .btn-rent",
    );
    botonesAlquilar.forEach((boton) => {
      boton.addEventListener("click", function () {
        const idPelicula = parseInt(this.getAttribute("data-id"));
        agregarAlCarrito(idPelicula);
      });
    });
  }

  enlacesGeneros.forEach((enlace) => {
    enlace.addEventListener("click", function (evento) {
      evento.preventDefault();
      const generoSeleccionado = this.textContent.trim();
      renderizarCatalogo(generoSeleccionado);
    });
  });

  renderizarCatalogo("Todos");
}

/*5. LÓGICA DE LA PÁGINA DE INICIO*/
const botonesInicio = document.querySelectorAll(
  ".btn-rent:not(.categories-content .btn-rent)",
);

if (botonesInicio.length > 0) {
  botonesInicio.forEach((boton) => {
    boton.addEventListener("click", function () {
      const idPelicula = parseInt(this.getAttribute("data-id"));
      agregarAlCarrito(idPelicula);
    });
  });
}

actualizarContadorCarrito();
