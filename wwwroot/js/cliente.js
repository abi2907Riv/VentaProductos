function ObtenerClientes() {
    fetch('https://localhost:7245/Clientes')
    .then(response => response.json())
    .then(data => MostrarClientes(data))
    .catch(error => console.log("No se pudo acceder al servicio.", error));
}

function MostrarClientes(data) {
    let tbody = document.getElementById('todosLosClientes');
    tbody.innerHTML = '';

    data.forEach(element => {
        let tr = tbody.insertRow();

        let td0 = tr.insertCell(0);
        let tdId = document.createTextNode(element.id);
        td0.appendChild(tdId);

        let td1 = tr.insertCell(1);
        let tdName = document.createTextNode(element.nombre);
        td1.appendChild(tdName);

        let td2 = tr.insertCell(2);
        let tdApellido = document.createTextNode(element.apellido);
        td2.appendChild(tdApellido);

        let td3 = tr.insertCell(3);
        let tdDni = document.createTextNode(element.dni);
        td3.appendChild(tdDni);

        let td4 = tr.insertCell(4);
        let tdSaldo = document.createTextNode(element.saldo);
        td4.appendChild(tdSaldo);

        let btnEditar = document.createElement('button');
        btnEditar.innerText = 'Modificar';
        btnEditar.setAttribute('class', 'btn btn-info');
        btnEditar.setAttribute('onclick', `BuscarClienteId(${element.id})`);
        let td5 = tr.insertCell(5);
        td5.appendChild(btnEditar);

        let btnEliminar = document.createElement('button');
        btnEliminar.innerText = 'Eliminar';
        btnEliminar.setAttribute('class', 'btn btn-danger');
        btnEliminar.setAttribute('onclick', `EliminarCliente(${element.id})`);
        let td6 = tr.insertCell(6);
        td6.appendChild(btnEliminar);
    });
}


function CrearCliente() {
    let cliente = {
        nombre: document.getElementById("Nombre").value,
        apellido: document.getElementById("Apellido").value,
        dni: document.getElementById("Dni").value,
        saldo: document.getElementById("Saldo").value,
    };

    fetch('https://localhost:7245/Clientes',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(cliente)
        }
    )
    .then(response => response.json())
    .then(data =>{
            document.getElementById("Nombre").value = "";
            document.getElementById("Apellido").value = "";
            document.getElementById("Dni").value = "";
            document.getElementById("Saldo").value = 0;

            $('#modalAgregarClientes').modal('hide');
            ObtenerClientes();
            
    })
    .catch(error => console.log("Hubo un error al guardar el Cliente nuevo, verifique el mensaje de error: ", error))
}


function EliminarCliente(id) {
    var siElimina = confirm("¿Esta seguro de borrar este cliente?.")
    if (siElimina == true) {
        EliminarSi(id);
    }
}

function EliminarSi(id) {
    fetch(`https://localhost:7245/Clientes/${id}`,
    {
        method: "DELETE"
    })
    .then(() => {
        ObtenerClientes();
    })
    .catch(error => console.error("No se pudo acceder a la api, verifique el mensaje de error: ", error))
}

function BuscarClienteId(id) {
    fetch(`https://localhost:7245/Clientes/${id}`,{
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("IdCliente").value = data.id;
        document.getElementById("NombreEditar").value = data.nombre;
        document.getElementById("ApellidoEditar").value = data.apellido;
        document.getElementById("DniEditar").value = data.dni;
        document.getElementById("SaldoEditar").value = data.saldo;

        $('#modalEditarClientes').modal('show');
    })
    .catch(error => console.error("No se pudo acceder a la api, verifique el mensaje de error: ", error));
}

function EditarCliente() {
    let idCliente = document.getElementById("IdCliente").value;

    let editarCliente = {
        id: idCliente,
        nombreCliente: document.getElementById("NombreEditar").value,
        apellidoCliente: document.getElementById("ApellidoEditar").value,
        dniCliente: document.getElementById("DniEditar").value,
        saldo: document.getElementById("SaldoEditar").value,
    }

    fetch(`https://localhost:7245/Clientes/${idCliente}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editarCliente)
    })
    .then(data => {

            document.getElementById("IdCliente").value = 0;
            document.getElementById("NombreEditar").value = "";
            document.getElementById("ApellidoEditar").value = "";
            document.getElementById("DniEditar").value = 0;
            document.getElementById("SaldoEditar").value = 0;
            $('#modalEditarClientes').modal('hide');
            ObtenerClientes();
    })
    .catch(error => console.error("No se pudo acceder a la api, verifique el mensaje de error: ", error))
}