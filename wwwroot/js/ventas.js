function ObtenerVentas() {
    fetch('https://localhost:7245/api/Ventas')
    .then(response => response.json())
    .then(data => MostrarVentas(data))
    .catch(error => console.log("No se pudo acceder al servicio.", error));
}

function MostrarVentas(data) {
    let tbody = document.getElementById('todosLasVentas');
    tbody.innerHTML = '';

    console.log(data);

    data.forEach(element => {
        let tr = tbody.insertRow();

        let td0 = tr.insertCell(0);
        let tdId = document.createTextNode(element.id);
        td0.appendChild(tdId);

        let td1 = tr.insertCell(1);
        let tdFechaVenta = document.createTextNode(element.fechaVenta);
        td1.appendChild(tdFechaVenta);


        let td2 = tr.insertCell(2);
        let estadoFinalizada = element.finalizada ? "Finalizada" : "Pendiente";
        let tdFinalizada = document.createTextNode(estadoFinalizada);
        td2.appendChild(tdFinalizada);

        // let td3 = tr.insertCell(3);
        // let tdCliente = document.createTextNode(element.cliente.nombreCliente);
        // td3.appendChild(tdCliente);


        let btnEditar = document.createElement('button');
        btnEditar.innerText = 'Modificar';
        btnEditar.setAttribute('class', 'btn btn-info');
        btnEditar.setAttribute('onclick', `BuscarVentaId(${element.id})`);
        let td4 = tr.insertCell(3);
        td4.appendChild(btnEditar);

        let btnEliminar = document.createElement('button');
        btnEliminar.innerText = 'Eliminar';
        btnEliminar.setAttribute('class', 'btn btn-danger');
        btnEliminar.setAttribute('onclick', `EliminarVenta(${element.id})`);
        let td5 = tr.insertCell(4);
        td5.appendChild(btnEliminar);

        let btnDetalle = document.createElement('button');
        btnDetalle.innerText = 'Detalle';
        btnDetalle.setAttribute('class', 'btn btn-success');
        btnDetalle.setAttribute('onclick', `BuscarProductoDetalle(${element.id})`);
        let td6 = tr.insertCell(5);
        td5.appendChild(btnDetalle);
    });
}


function CrearVenta() {
    const IdCliente = document.getElementById('IdCliente').value;

    let venta = {
        fechaVenta: document.getElementById('FechaVenta').value,
        finalizada: document.getElementById('Finalizada').checked,
        idCliente: IdCliente,
        cliente: null,
        detalleVenta: null
    }

    console.log(venta);

    fetch('https://localhost:7245/api/Ventas',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(venta)
        })

    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {throw new Error (error.message);});
        }
        return response.json();
    })
    .then(data =>{
            document.getElementById("FechaVenta").value = "";
            document.getElementById("Finalizada").checked = false;
            document.getElementById("IdCliente").value = 0;

            $("error").empty();
            $("#error").attr("hidden", true);

            $('#modalAgregarVentas').modal('hide');
            ObtenerVentas();
        // }
        // else {
        //     mensajesError('#error', data);
        // }
    })
    .catch(error => console.log("Hubo un error al guardar el Cliente nuevo, verifique el mensaje de error: ", error))
}


function EliminarVenta(id) {
    var siEliminaVenta = confirm("¿Esta seguro de borrar esta venta?.")
    if (siEliminaVenta == true) {
        EliminarSi(id);
    }
}

function EliminarSi(id) {
    fetch(`https://localhost:7245/api/Ventas/${id}`,
    {
        method: "DELETE"
    })
    .then(() => {
        ObtenerVentas();
    })
    .catch(error => console.error("No se pudo acceder a la api, verifique el mensaje de error: ", error))
}

function BuscarVentaId(id) {
    fetch(`https://localhost:7245/api/Ventas/${id}`,{
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("IdVentas").value = data.id;
        document.getElementById("FechaVentaEditar").value = data.fechaVenta;
        document.getElementById("FinalizadaEditar").checked = data.finalizada;
        document.getElementById("IdClienteEditar").value = data.idCliente;

        $('#modalEditarVentas').modal('show');
    })
    .catch(error => console.error("No se pudo acceder a la api, verifique el mensaje de error: ", error));
}

function EditarVenta() {
    let idVenta = document.getElementById("IdVentas").value;

    let venta = {
        id: idVenta,
        fechaventa: document.getElementById("FechaVentaEditar").value,
        finalizada: document.getElementById("FinalizadaEditar").checked,
        idCliente: document.getElementById("IdClienteEditar").value,
        cliente: null,
    };

    fetch(`https://localhost:7245/api/Ventas/${idVenta}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(venta)
    })
    .then(response => response.json())
    .then(data => {
        // console.log(data)
        if(data.status == undefined){

            document.getElementById("IdVentas").value = 0;
            document.getElementById("FechaVentasEditar").value = "";
            document.getElementById("FinalizadaEditar").checked = false;
            document.getElementById("IdClienteEditar").value = 0;

            $('#errorEditar').empty();
            $('#errorEditar').attr("hidden", true);
            $('#modalEditarVentas').modal('hide');
            ObtenerVentas();

        }

        // } else {
        //     mensajesError('#error', data);
        // }

    })
    .catch(error => console.error("No se pudo acceder a la api, verifique el mensaje de error: ", error))
}



function mensajesError(id, data, mensaje) {
    console.log();
    $(id).empty();
    if (data != null) {
        $.each(data.errors, function(index, item) {
            $(id).append(
                "<ol>",
                "<li>" + item + "</li>",
                "</ol>"
            )
        })
    }
    else{
        $(id).append(
            "<ol>",
            "<li>" + mensaje + "</li>",
            "</ol>"
        )
    }
    
    $(id).attr("hidden", false);
}

function BuscarProductoDetalle(id) {
    fetch(`https://localhost:7245/api/DetalleVentas/${id}`, {
        method: "GET"
    })
    .then(response => response.json())
    .then(async data => {
        MostrarProductosDetalle(data);
        await ObtenerProductosDropdown();
        FiltrarDropdownProductos();
        document.getElementById("IdDetalleVentas").value = id;
        $('#modalDetalleVentas').modal('show');
    })
    .catch(error => console.error("No se pudo acceder a la api, verifique el mensaje de error: ", error));
}

function MostrarProductosDetalle(data) {
    $("#todosLosDetalles").empty();
    $.each(data, function (index, item) {
        const cantidad = item.producto.cantidad;
        const precioVenta = item.producto.precioVenta;
        const total = cantidad * precioVenta;
        $('#todosLosDetalles').append(
            `<tr>
                <td>${item.producto.nombreProducto}</td>
                <td>${cantidad}</td>
                <td>${precioVenta}</td>
                <td>${total.toFixed(2)}</td> 
            </tr>`
        );
    });
}