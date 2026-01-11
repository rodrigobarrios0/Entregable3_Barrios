let carrito = [];


//Cards
function mostrarJuegos(productos) {
    const contenedor = document.getElementById("cards-container");

    productos.forEach((producto) => {
        const card = document.createElement("div");

        card.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>Género: ${producto.genero}</p>
        <p>Plataforma: ${producto.plataforma}</p>
        <p>Precio: ${producto.precio}</p>
        <button id="btn-${producto.id}">Agregar al carrito</button>
        `
        contenedor.appendChild(card);

        const boton = document.getElementById(`btn-${producto.id}`);

        boton.addEventListener("click", () => {
            agregarAlCarrito(producto);
            mostrarCarrito();
            Toastify({
                text: "Producto agregado al carrito",
                gravity: "bottom",
                position: "right",
                style: {
                background: "linear-gradient(to right, #1c1f1eff, #272525ff)",
                border: "2px solid #473c1aff",
                },
                duration: 3000
            }).showToast();
        });
        }
    )};


    //JSON
const rutaProductos = "./assets/items/juegos.json";

const obtenerProductos = async () => {
    try {
        const resp = await fetch(rutaProductos);
        const data = await resp.json();
        mostrarJuegos(data);
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
};

obtenerProductos();


//Carrito
function agregarAlCarrito(producto) {
    const productoExistente = carrito.find(item => item.id === producto.id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        producto.cantidad = 1;
        carrito.push(producto);
    }
    guardarCarrito();
};

function mostrarCarrito(){
    const contenedorCarrito = document.getElementById("carrito-container");
    contenedorCarrito.innerHTML = "";
    
    carrito.forEach((item, index) => {
        const div = document.createElement("div");
        div.innerHTML += `
        <p>${item.nombre} x${item.cantidad}</p>
        `;

    //Btn restar
    const btnRestar = document.createElement("button");
        btnRestar.innerText = "-";

    btnRestar.addEventListener("click", () => {
            if (item.cantidad > 1) {
                item.cantidad--;
            } else {
                carrito.splice(index, 1);
            }
            guardarCarrito();
            mostrarCarrito();
        });

    //Btn eliminar
    const btnEliminar = document.createElement("button");
        btnEliminar.innerText = "Eliminar";

    btnEliminar.addEventListener("click", () => {
            carrito.splice(index, 1);
            guardarCarrito();
            mostrarCarrito();
        });

        div.appendChild(btnRestar);
        div.appendChild(btnEliminar);

        contenedorCarrito.appendChild(div);
    });
    
    const totalCompra = calcularTotal();
    
    const divResumen = document.createElement('div');
    divResumen.innerHTML = `
    <h3>Total: $${totalCompra}</h3>
    <button id="vaciarCarritoBtn">Vaciar Carrito</button>
    <button id="compra">Comprar</button>
    `;

    contenedorCarrito.appendChild(divResumen);
    
    const botonComprar = divResumen.querySelector(`#compra`);
    botonComprar.addEventListener('click', () => {
        Swal.fire({
            position: "center",
            theme: "dark",
            icon: "success",
            title: "Tu compra ha sido realizada con éxito",
            showConfirmButton: false,
            timer: 1500
        });
        vaciarCarrito();
    });
    
    const botonVaciar = divResumen.querySelector('#vaciarCarritoBtn');
    botonVaciar.addEventListener('click', () => {
        Swal.fire({
            title: "¿Desea vaciar el carrito?",
            theme: "dark",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ffbf00",
            cancelButtonColor: "rgba(53, 52, 52, 1)",
            confirmButtonText: "Vaciar"
        }).then((result) => {
            
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Carrito vaciado",
                    theme: "dark",
                    text: "Tus productos han sido eliminados del carrito.",
                    confirmButtonColor: "#ffbf00",
                    icon: "success"
                });
                vaciarCarrito();
            }
        });
    });
};

function guardarCarrito(){ 
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarrito(){
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado){
        carrito = JSON.parse(carritoGuardado) || [];
        mostrarCarrito();
    }
};

cargarCarrito();

function vaciarCarrito() {
    carrito.length = 0;
    guardarCarrito();
    mostrarCarrito();
};

function calcularTotal(){
    return carrito.reduce((total, item) => total + (parseFloat(item.precio.replace("$"," ")) * item.cantidad), 0);
};