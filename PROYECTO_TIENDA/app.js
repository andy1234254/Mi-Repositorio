const contenedorProductos = document.getElementById("productos");

async function cargarProductos() {
    try{
const response = await fetch("https://fakestoreapi.com/products");
if (!response.ok) {
    throw new Error("Error en la respuesta de la API");
    }
const productos = await response.json();
if(productos.length === 0) {
    console.log("No hay productos disponibles");
    } else{
        mostrarProductos(productos);
    }

} catch (error) {
    console.error("Error al obtener los productos:", error);
    }
}
function mostrarProductos(productos) {
    contenedorProductos.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevos productos

    productos.forEach((producto) => {
        const productoDiv = document.createElement("div");
        productoDiv.classList = "bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-shadow duration-300";
productoDiv.innerHTML = `
<img src="${producto.image}" alt="${producto.title}" class="w-32 h-32 object-cover mb-4 rounded-lg">
        
`;
contenedorProductos.appendChild(productoDiv);
    });
}
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});