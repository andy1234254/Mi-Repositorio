// Referencias a elementos del DOM
const contenedorProductos = document.getElementById("productos"); // Contenedor donde se mostrarán los productos
const searchForm = document.getElementById("search-form"); // Formulario de búsqueda
const searchInput = document.getElementById("search-input"); // Campo de texto para buscar productos

// Botones para filtrar productos por categoría
const btnTodos = document.getElementById("btn-todos"); // Botón para mostrar todos los productos
const btnTecnologia = document.getElementById("btn-tecnologia"); // Botón para filtrar productos de tecnología
const btnHombre = document.getElementById("btn-hombre"); // Botón para filtrar ropa para hombre
const btnMujer = document.getElementById("btn-mujer"); // Botón para filtrar ropa para mujer
const btnJoyas = document.getElementById("btn-joyas"); // Botón para filtrar joyas

// Variable global para almacenar todos los productos cargados desde la API
let productosGlobal = [];
let categoriaSeleccionada = "all";

// Función para cargar productos desde la API
async function cargarProductos() {
    try {
        // Realiza una solicitud a la API
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
            throw new Error("Error en la respuesta de la API");
        }

        // Convierte la respuesta en un objeto JSON
        const productos = await response.json();

        // Verifica si hay productos disponibles
        if (productos.length === 0) {
            console.log("No hay productos disponibles");
        } else {
            // Guarda los productos en la variable global
            productosGlobal = productos;

            // Muestra todos los productos en la página
            mostrarProductos(productos);
        }
    } catch (error) {
        // Muestra un error en la consola si ocurre un problema
        console.error("Error al obtener los productos:", error);
    }
}

// Función para mostrar productos en el contenedor
function mostrarProductos(productos) {
    // Limpia el contenedor antes de agregar nuevos productos
    contenedorProductos.innerHTML = "";

    // Recorre la lista de productos y los agrega al contenedor
    productos.forEach((producto) => {
        const productoDiv = document.createElement("div");
        productoDiv.classList = "bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-shadow duration-300";

        // Estructura HTML para mostrar cada producto
        productoDiv.innerHTML = `
            <img src="${producto.image}" alt="${producto.title}" class="w-32 h-32 object-cover mb-4 rounded-lg">
            <h2 class="text-lg font-bold text-center">${producto.title}</h2>
            <p class="text-gray-700 text-center">$${producto.price}</p>
            <!-- Botón para agregar al carrito -->
            <button 
                class="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
                onclick="agregarAlCarrito('${producto.id}')"
            >
                Agregar al carrito
            </button>
        `;

        // Agrega el producto al contenedor
        contenedorProductos.appendChild(productoDiv);
    });
}

// Función para manejar el evento de agregar al carrito
function agregarAlCarrito(productoId) {
    console.log(`Producto con ID ${productoId} agregado al carrito.`);
    // Aquí puedes implementar la lógica para agregar el producto al carrito
}

// Función para normalizar texto (elimina tildes y convierte a minúsculas)
function normalizarTexto(texto) {
    return texto
        .toLowerCase() // Convierte a minúsculas
        .normalize("NFD") // Descompone caracteres con tildes
        .replace(/[\u0300-\u036f]/g, ""); // Elimina los diacríticos (tildes)
}

// Función para filtrar productos según el término de búsqueda
function filtrarProductosPorBusqueda(termino) {
    const terminoNormalizado = normalizarTexto(termino); // Normaliza el término de búsqueda
    const productosFiltrados = productosGlobal.filter((producto) =>
        normalizarTexto(producto.title).includes(terminoNormalizado)
    );
    mostrarProductos(productosFiltrados); // Muestra los productos filtrados
}

// Función para filtrar productos por categoría
function filtrarPorCategoria(categoria) {
    if (categoria === "todos") {
        // Si la categoría es "todos", muestra todos los productos
        mostrarProductos(productosGlobal);
    } else {
        // Filtra los productos que coincidan con la categoría
        const productosFiltrados = productosGlobal.filter((producto) =>
            normalizarTexto(producto.category) === categoria
        );

        // Muestra los productos filtrados
        mostrarProductos(productosFiltrados);
    }
}

// Función para cargar categorías desde la API
async function cargarCategorias() {
    try {
        // Realiza una solicitud a la API para obtener las categorías
        const response = await fetch("https://fakestoreapi.com/products/categories");
        if (!response.ok) {
            throw new Error("Error en la respuesta de la API");
        }

        // Convierte la respuesta en un objeto JSON
        const categorias = await response.json();
        mostrarCategorias(["all", ...categorias]); // Muestra las categorías en el contenedor
    } catch (error) {
        // Muestra un error en la consola si ocurre un problema
        console.error("Error al obtener las categorías:", error);
    }
}

// Función para mostrar las categorías en botones
function mostrarCategorias(categorias) {
    contenedorCategorias.innerHTML = ""; // Limpia el contenedor de categorías
    categorias.forEach((cat) => {
        const btn = document.createElement("button"); // Crea un botón para cada categoría
        btn.textContent = cat === "all" ? "Todos" : cat.charAt(0).toUpperCase() + cat.slice(1); // Capitaliza el texto

        // Aplica estilos según si la categoría está seleccionada o no
        btn.className = `px-4 py-2 rounded-full ${
            categoriaSeleccionada === cat ? "bg-blue-600 text-white" : "bg-gray-300 text-blue-500"
        } hover:bg-blue-600 hover:text-white transition duration-300`;

        // Evento para actualizar la categoría seleccionada
        btn.addEventListener("click", () => {
            categoriaSeleccionada = cat; // Actualiza la categoría seleccionada
            mostrarCategorias(categorias); // Actualiza los botones para reflejar la selección
            filtrarProductos(); // Filtra los productos según la categoría seleccionada
        });

        // Agrega el botón al contenedor
        contenedorCategorias.appendChild(btn);
    });
}

// Función para filtrar productos según la categoría seleccionada
function filtrarProductos() {
    let filtrados = productosGlobal; // Usa todos los productos como base
    if (categoriaSeleccionada !== "all") {
        // Filtra los productos según la categoría seleccionada
        filtrados = productosGlobal.filter((p) => p.category === categoriaSeleccionada);
    }
    mostrarProductos(filtrados); // Muestra los productos filtrados
}

// Evento para el formulario de búsqueda
searchForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario
    const termino = searchInput.value.trim(); // Obtiene el texto ingresado
    filtrarProductosPorBusqueda(termino); // Filtra los productos según el texto
});

// Eventos para los botones de filtro
btnTodos.addEventListener("click", () => filtrarPorCategoria("todos")); // Muestra todos los productos
btnTecnologia.addEventListener("click", () => filtrarPorCategoria("electronics")); // Filtra productos de tecnología
btnHombre.addEventListener("click", () => filtrarPorCategoria("men's clothing")); // Filtra ropa para hombre
btnMujer.addEventListener("click", () => filtrarPorCategoria("women's clothing")); // Filtra ropa para mujer
btnJoyas.addEventListener("click", () => filtrarPorCategoria("jewelery")); // Filtra joyas

// Carga los productos y las categorías al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos(); // Carga los productos desde la API
    cargarCategorias(); // Carga las categorías desde la API
});