document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uepsForm');
    const salidaForm = document.getElementById('salidaForm');
    const movimientosTable = document.getElementById('movimientosTable');
    const cantidadTotalDiv = document.getElementById('cantidadTotal');
    const entries = [];
    const salidas = [];
    let cantidadTotal = 0;
    let costoTotal = 0;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const fecha = document.getElementById('fecha').value;
        const cantidad = parseInt(document.getElementById('cantidad').value);
        const costoUnitario = parseFloat(document.getElementById('costoUnitario').value);

        if (fecha && !isNaN(cantidad) && !isNaN(costoUnitario)) {
            const entry = {
                fecha,
                cantidad,
                costoUnitario,
                costoTotal: cantidad * costoUnitario
            };

            entries.push(entry);
            cantidadTotal += cantidad;
            costoTotal += entry.costoTotal;
            updateMovimientosTable(entry, 'Entrada');
            updateCantidadTotal();
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
                cantidadTotal -= salidaCantidad;
                costoTotal -= salida.costoTotal;
                updateMovimientosTable(salida, 'Salida');
                updateCantidadTotal();
                salidaForm.reset();
            }
        } else {
            alert('Por favor, complete todos los campos correctamente.');
        }
    });

    function updateMovimientosTable(movimiento, tipo) {
        const row = movimientosTable.insertRow();

        row.insertCell(0).innerText = movimiento.fecha;
        row.insertCell(1).innerText = tipo;
        row.insertCell(2).innerText = movimiento.cantidad;
        row.insertCell(3).innerText = movimiento.costoUnitario.toFixed(2);
        row.insertCell(4).innerText = movimiento.costoTotal.toFixed(2);
        
        // Calculate average unit cost for saldo
        const saldoCostoUnitario = cantidadTotal ? (costoTotal / cantidadTotal).toFixed(2) : 0;

        row.insertCell(5).innerText = cantidadTotal;
        row.insertCell(6).innerText = saldoCostoUnitario;
        row.insertCell(7).innerText = costoTotal.toFixed(2);
    }

    function registrarSalida(salidaFecha, salidaCantidad) {
        let cantidadRestante = salidaCantidad;
        let costoTotalSalida = 0;

        for (let i = 0; i < entries.length; i++) {
            const entrada = entries[i];

            if (entrada.cantidad <= cantidadRestante) {
                costoTotalSalida += entrada.cantidad * entrada.costoUnitario;
                cantidadRestante -= entrada.cantidad;
                entrada.cantidad = 0;
            } else {
                costoTotalSalida += cantidadRestante * entrada.costoUnitario;
                entrada.cantidad -= cantidadRestante;
                cantidadRestante = 0;
                break;
            }
        }

        if (cantidadRestante > 0) {
            alert('No hay suficiente inventario para cubrir la salida.');
            return null;
        } else {
            return {
                fecha: salidaFecha,
                cantidad: salidaCantidad,
                costoUnitario: costoTotalSalida / salidaCantidad,
                costoTotal: costoTotalSalida
            };
        }
    }

    function updateCantidadTotal() {
        cantidadTotalDiv.innerText = cantidadTotal;
    }
});
