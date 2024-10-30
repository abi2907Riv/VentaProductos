function ObtenerProductosDropdown() {
    fetch('https://localhost:7245/Productos')
        .then(response => response.json())
        .then (async data => {
            localStorage.setItem('productos', JSON.stringify(data));
        })
        .catch(error => console.log("No se pudo acceder al servicio.", error));
}

function FiltrarDropdownProductos() {
    let todosLosProductos = localStorage.getItem('productos')
    todosLosProductos = JSON.parse(todosLosProductos);

    $('#ProductoIdDetalle').empty();
    todosLosProductos.forEach(item => {
        $('#ProductoIdDetalle').append(
            `<option value="${item.Id}">${item.nombreProducto}</option>`
        );
    });
}