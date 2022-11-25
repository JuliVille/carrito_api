const productos = document.getElementById("productos");
const eliminarC = document.getElementById("eliminar");
const agregar = document.getElementById("agregar");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const fragment = document.createDocumentFragment();
const templateProductos = document.getElementById("template-productos").content
const templateItems = document.getElementById("template-items").content
const templateFooter = document.getElementById("template-footer").content

const carrito = {};
const personajes = [];
let person = {};
let ap = []

document.addEventListener('DOMContentLoaded', e => {fetchData()})
document.addEventListener('click', e=>{agregarCarrito(e)})
document.addEventListener('click', e=>{eliminarCards(e)})
document.addEventListener('click', e=>{editarCards(e)})

agregar.addEventListener('click', ()=>{agregarCards()})

items.addEventListener('click', e=>{btnAgregarEliminarProductos(e)})

const fetchData = async () => {
    const res = await fetch('https://rickandmortyapi.com/api/character/');
    const data = await res.json();
    ap = data.results
    mapearPersonajes()
    pintarCards();
}

function ramdom(max) {
    return Math.floor(Math.random() * max);
}


function mapearPersonajes(){
    ap.forEach((item) =>{
        const precio = ramdom(200);
        let {id, name, image} = item;
        person = {"id":id, "name":name, "image":image, "precio":precio};
        personajes.push(person);
    })
}

const pintarCards = () =>{
    personajes.forEach(item =>{
        templateProductos.querySelector('h5').textContent=item.name;
        templateProductos.querySelector('span').textContent=item.precio;
        templateProductos.querySelector('img').setAttribute("src", item.image)
        templateProductos.querySelector('button').dataset.id=item.id;
        const clone = templateProductos.cloneNode(true);
        fragment.appendChild(clone);
    })
    productos.appendChild(fragment);
}

const agregarCards = () =>{
    const idP = document.getElementById("idP").value;
    const nombre = document.getElementById("nombre").value;
    const imagen = document.getElementById("imagen").value;
    const precio = document.getElementById("precio").value;

    const agregar = {
        id: parseInt(idP),
        name: nombre,
        image: imagen,
        precio: parseInt(precio)
    }
    personajes.push(agregar);
    productos.innerHTML="";
    pintarCards();
    limpiar();
}


const editarCards = (e) =>{
    if(e.target.classList.contains('btn-primary')){
        document.getElementById("nombre").value = e.target.parentElement.children[0].textContent ;
        document.getElementById("precio").value = e.target.parentElement.children[1].children[0].textContent;
        document.getElementById("idP").value = e.target.parentElement.children[2].dataset.id;
        document.getElementById("imagen").value = e.target.parentElement.parentElement.children[0].getAttribute("src");
        console.log(personajes)

        /*nombre = e.target.parentElement.children[0].textContent = document.getElementById("nombre");
        precio = e.target.parentElement.children[1].children[0].textContent = document.getElementById("precio");
        idp = e.target.parentElement.children[2].dataset.id = document.getElementById("idP");
        imagen = e.target.parentElement.parentElement.children[0].getAttribute("src") = document.getElementById("imagen");*/
        
    }
}

const limpiar = () =>{
    document.getElementById("idP").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("imagen").value = "";
    document.getElementById("precio").value = 0;

}

const eliminarCards = e =>{
    if(e.target.classList.contains('eliminar')){
        if(personajes.length>0){
            idP = e.target.parentElement.children[2].dataset.id;
            productos.innerHTML = ""
            delete personajes[parseInt(idP)-1];
        }
            pintarCards()
        }
    
    e.stopPropagation();
}


const agregarCarrito = e =>{
    if(e.target.classList.contains('btn-dark')){
        llenarCarro(e.target.parentElement)
    }
    e.stopPropagation();
}

const llenarCarro = item =>{
    const producto = {
        id: item.querySelector('button').dataset.id,
        precio: item.querySelector('span').textContent,
        titulo: item.querySelector('h5').textContent,
        cantidad: 1
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad+1;
    }
    carrito[producto.id] = {...producto}
    pintarProductos();
}

const pintarProductos = () =>{
    items.innerHTML='';
    Object.values(carrito).forEach(producto =>{
        templateItems.querySelector('th').textContent=producto.id;
        templateItems.querySelectorAll('td')[0].textContent = producto.titulo;
        templateItems.querySelectorAll('td')[1].textContent = producto.cantidad;
        templateItems.querySelector('span').textContent=producto.precio * producto.cantidad;

        templateItems.querySelector('.btn-info').dataset.id=producto.id;
        templateItems.querySelector('.btn-danger').dataset.id=producto.id;

        const clone = templateItems.cloneNode(true);
        fragment.append(clone);
    })
    items.appendChild(fragment);
    pintarFooter();
}

const pintarFooter = () =>{
    footer.innerHTML='';

    if(Object.values(carrito).length === 0){
        footer.innerHTML = `
        <th scope="row" colspan="5"> No hay elementos en el carro de compra</th>
        `
        return
    }

    const cantidad_productos = Object.values(carrito).reduce((acc,{cantidad}) =>acc + cantidad, 0);
    const valor_total = Object.values(carrito).reduce((acc,{cantidad,precio}) =>acc + cantidad * precio, 0);

    templateFooter.querySelectorAll('td')[0].textContent=cantidad_productos;
    templateFooter.querySelectorAll('span')[0].textContent=valor_total;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);

    footer.appendChild(fragment);

    const boton = document.querySelector('#vaciar-todo');
    boton.addEventListener('click', ()=>{
        carrito = {}
        pintarProductos();
    })
}

const btnAgregarEliminarProductos = e =>{
    if(e.target.classList.contains('btn-info')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad ++;
        carrito[e.target.dataset.id] = {...producto}
        pintarProductos();
    }

    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad --;
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }else{
            carrito[e.target.dataset.id] = {...producto}
        }
        pintarProductos();
    }
}

