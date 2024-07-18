document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uepsForm');
    const salidaForm = document.getElementById('salidaForm');
    const entriesTable = document.getElementById('entriesTable');
    const salidasTable = document.getElementById('salidasTable');
    const entries = [];
    const salidas = [];

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const fecha = document.getElementById('fecha').value;
        const cantidad = parseInt(document.getElementById('cantidad').value);
        const costoUnitario = parseFloat(document.getElementById('costoUnitario').value);

        if (fecha && !isNaN(cantidad) && !isNaN(costoUnitario)) {
            const entry = {
                fecha,
                cantidad,
                costoUnitario
            };

            entries.push(entry);
            updateEntriesTable();
            form.reset();
        } else {
            alert('Por favor, complete todos los campos correctamente.');
        }
    });

    salidaForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const salidaFecha = document.getElementById('salidaFecha').value;
        const salidaCantidad = parseInt(document.getElementById('salidaCantidad').value);

        if (salidaFecha && !isNaN(salidaCantidad)) {
            const salida = registrarSalida(salidaFecha, salidaCantidad);
            if (salida) {
                salidas.push(salida);
                updateEntriesTable();
                updateSalidasTable();
                salidaForm.reset();
            }
        } else {
            alert('Por favor, complete todos los campos correctamente.');
        }
    });

    function updateEntriesTable() {
        entriesTable.innerHTML = `
            <tr>
                <th>Fecha</th>
                <th>Cantidad</th>
                <th>Costo Unitario</th>
                <th>Costo Total</th>
            </tr>
        `;

        entries.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Ordena por fecha (últimas entradas primero)

        entries.forEach(entry => {
            const row = entriesTable.insertRow();
            row.insertCell(0).innerText = entry.fecha;
            row.insertCell(1).innerText = entry.cantidad;
            row.insertCell(2).innerText = entry.costoUnitario.toFixed(2);
            row.insertCell(3).innerText = (entry.cantidad * entry.costoUnitario).toFixed(2);
        });
    }

    function registrarSalida(salidaFecha, salidaCantidad) {
        let cantidadRestante = salidaCantidad;
        let costoTotalSalida = 0;

        while (cantidadRestante > 0 && entries.length > 0) {
            const ultimaEntrada = entries[0];

            if (ultimaEntrada.cantidad <= cantidadRestante) {
                costoTotalSalida += ultimaEntrada.cantidad * ultimaEntrada.costoUnitario;
                cantidadRestante -= ultimaEntrada.cantidad;
                entries.shift(); // Elimina la última entrada
            } else {
                costoTotalSalida += cantidadRestante * ultimaEntrada.costoUnitario;
                ultimaEntrada.cantidad -= cantidadRestante;
                cantidadRestante = 0;
            }
        }

        if (cantidadRestante > 0) {
            alert('No hay suficiente inventario para cubrir la salida.');
            return null;
        } else {
            return {
                salidaFecha,
                salidaCantidad,
                costoTotalSalida: costoTotalSalida.toFixed(2)
            };
        }
    }

    function updateSalidasTable() {
        salidasTable.innerHTML = `
            <tr>
                <th>Fecha de Salida</th>
                <th>Cantidad de Salida</th>
                <th>Costo Total de Salida</th>
            </tr>
        `;

        salidas.forEach(salida => {
            const row = salidasTable.insertRow();
            row.insertCell(0).innerText = salida.salidaFecha;
            row.insertCell(1).innerText = salida.salidaCantidad;
            row.insertCell(2).innerText = salida.costoTotalSalida;
        });
    }
});
