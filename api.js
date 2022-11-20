const productos = document.getElementById("productos");
const fragment = document.createDocumentFragment();
document.addEventListener('DOMContentLoaded', e => {fetchData()})
const fetchData = async () => {
    const res = await fetch('api.json');
    const data = await res.json();
    pintarCards(data);
}

const pintarCards = data =>{
    const templateProductos = document.getElementById("template-productos").content
    data.forEach(item =>{
        templateProductos.querySelector('h5').textContent=item.titulo;
        templateProductos.querySelector('p').textContent=item.precio;
        templateProductos.querySelector('img').setAttribute("src", item.imagen)
        templateProductos.querySelector('button').dataset.id=item.id;
        const clone = templateProductos.cloneNode(true);
        fragment.appendChild(clone);
    })
    productos.appendChild(fragment);
}