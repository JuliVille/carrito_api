const productos = document.getElementById("productos");
const eliminarC = document.getElementById("eliminar");
const agregar = document.getElementById("agregar");
const editar = document.getElementById("editar");
const error = document.getElementById("error");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const fragment = document.createDocumentFragment();
const templateProductos = document.getElementById("template-productos").content
const templateItems = document.getElementById("template-items").content
const templateFooter = document.getElementById("template-footer").content

document.addEventListener('DOMContentLoaded', e => {fetchData()})
document.addEventListener('click', e=>{agregarCarrito(e)})
document.addEventListener('click', e=>{eliminarCards(e)})
document.addEventListener('click', (e)=>{editarC(e)})

agregar.addEventListener('click', (e)=>{agregarCards(e)})
editar.addEventListener('click', (e)=>{editarCards(e)})

let carrito = {};
let personajes = [];
let api = [];
let idP = 20;

items.addEventListener('click', e=>{btnAgregarEliminarProductos(e)})

const fetchData = async () => {
    const res = await fetch('https://rickandmortyapi.com/api/character/');
    const data = await res.json();
    api = data.results;
    mapearPersonajes()
    pintarCards()
}

function ramdom(max) {
    return Math.floor(Math.random() * max);
}

function mapearPersonajes(){
    api.forEach((item) =>{
        const precio = ramdom(200);
        let {id, name, image} = item;
        const a = {"id":id, "name":name, "image":image, "precio":precio};
        personajes.push(a);
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
    console.log(personajes)
}

const agregarCards = (e) =>{
    const nombre = document.getElementById("nombre").value;
    const imagen = document.getElementById("imagen").value;
    const precio = document.getElementById("precio").value;

    let mensaje = [];

    if(nombre.length == 0){
        mensaje.push("Digite el nombre")
    }

    if(precio.length == 0){
        mensaje.push("Digite un precio")
    }

    if(imagen.length == 0){
        mensaje.push("Coloque una imagen")
    }


    error.innerHTML = mensaje.join(', ')    

    if(mensaje.length==0){
        idP++;
        const agregar = {
            id: parseInt(idP),
            name: nombre,
            image: imagen,
            precio: parseInt(precio)
        }        
        personajes.push(agregar);
        productos.innerHTML="";
        pintarCards();
        console.log(personajes)
        limpiar();
        editar.style.display= 'none';
    }
}


const editarC = (e) =>{
    if(e.target.classList.contains('btn-primary')){
        document.getElementById("nombre").value = e.target.parentElement.children[0].textContent;
        document.getElementById("precio").value = e.target.parentElement.children[1].children[0].textContent;
        document.getElementById("idP").value = e.target.parentElement.children[2].dataset.id;
        document.getElementById("imagen").value = e.target.parentElement.parentElement.children[0].getAttribute("src");  
        agregar.style.display= 'none';
        editar.style.display= 'block';
    }
}

const editarCards = (e) =>{
        const nombre = document.getElementById("nombre").value;
        const idP = document.getElementById("idP").value;
        const imagen = document.getElementById("imagen").value;
        const precio = document.getElementById("precio").value;

        let mensaje = [];

        if(nombre.length == 0){
            mensaje.push("Digite el nombre")
        }

        if(precio.length == 0){
            mensaje.push("Digite un precio")
        }

        if(imagen.length == 0){
            mensaje.push("Coloque una imagen")
        }

        error.innerHTML = mensaje.join(', ')

        if(mensaje.length==0){
            personajes[parseInt(idP)-1].id = idP
            personajes[parseInt(idP)-1].name = nombre
            personajes[parseInt(idP)-1].image = imagen
            personajes[parseInt(idP)-1].precio = precio
            console.log(idP + nombre + imagen + precio);
            productos.innerHTML="";
            pintarCards();
            agregar.style.display= 'block';
            editar.style.display= 'none';
            limpiar();
        } 
}

const limpiar = () =>{
    document.getElementById("idP").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("imagen").value = "";
    document.getElementById("precio").value = "";

}

const eliminarCards = e =>{
    if(e.target.classList.contains('eliminar')){
            idP = e.target.parentElement.children[2].dataset.id;
                productos.innerHTML = ""
                delete personajes[parseInt(idP)-1];
        pintarCards()
    }
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

