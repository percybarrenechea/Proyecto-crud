import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDOByv26MrMxJYbD6AqlHv7KKD_Il5Av5E",
    authDomain: "portafolio-barrenechea.firebaseapp.com",
    projectId: "portafolio-barrenechea",
    storageBucket: "portafolio-barrenechea.firebasestorage.app",
    messagingSenderId: "593036347782",
    appId: "1:593036347782:web:282784343a1734e3784407"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const atencionesRef = collection(db, "atenciones");

let idEdicion = null;


document.getElementById("formAtencion").addEventListener("submit", async function (event) {
    event.preventDefault();

    let cliente = document.getElementById("cliente").value;
    let tramite = document.getElementById("tramite").value;
    let fecha = document.getElementById("fecha").value;
    let estado = document.getElementById("estado").value;

    let additionalData = {};
    if (tramite === "Depósitos") {
        additionalData = {
            numeroCuenta: document.getElementById("numeroCuenta").value,
            montoDepositado: document.getElementById("montoDepositado").value,
            metodoDeposito: document.getElementById("metodoDeposito").value,
        };
    } else if (tramite === "Transacciones") {
        additionalData = {
            tipoTransaccion: document.getElementById("tipoTransaccion").value,
            montoTransaccion: document.getElementById("montoTransaccion").value,
            cuentaOrigen: document.getElementById("cuentaOrigen").value,
            cuentaDestino: document.getElementById("cuentaDestino").value,
        };
    } else if (tramite === "Préstamos") {
        additionalData = {
            tipoPrestamo: document.getElementById("tipoPrestamo").value,
            montoSolicitado: document.getElementById("montoSolicitado").value,
            estadoPrestamo: document.getElementById("estadoPrestamo").value,
        };
    } else if (tramite === "Cajas de Seguridad") {
        additionalData = {
            numeroCaja: document.getElementById("numeroCaja").value,
            fechaInicio: document.getElementById("fechaInicio").value,
            fechaVencimiento: document.getElementById("fechaVencimiento").value,
        };
    } else if (tramite === "Pagos") {
        additionalData = {
            tipoPago: document.getElementById("tipoPago").value,
            montoPago: document.getElementById("montoPago").value,
        };
    } else if (tramite === "Asesorías Financieras") {
        additionalData = {
            tipoAsesoria: document.getElementById("tipoAsesoria").value,
            ejecutivoAsignado: document.getElementById("ejecutivoAsignado").value,
        };
    }

    try {
        await addDoc(atencionesRef, {
            cliente,
            tramite,
            fecha,
            estado,
            ...additionalData,
        });
        this.reset();
        document.getElementById("dynamicFields").innerHTML = ""; 
    } catch (error) {
        console.error("Error al agregar la atención:", error);
    }
});

document.getElementById("tramite").addEventListener("change", function () {
    const tramite = this.value;
    const dynamicFields = document.getElementById("dynamicFields");
    dynamicFields.innerHTML = ""; 

    if (tramite === "Depósitos") {
        dynamicFields.innerHTML = `
            <label for="numeroCuenta">Número de Cuenta:</label>
            <input type="text" id="numeroCuenta" placeholder="Número de Cuenta" required>
            <label for="montoDepositado">Monto Depositado:</label>
            <input type="number" id="montoDepositado" placeholder="Monto Depositado" required>
            <label for="metodoDeposito">Método de Depósito:</label>
            <select id="metodoDeposito" required>
                <option value="" disabled selected>Seleccionar Método</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Cheque">Cheque</option>
            </select>
        `;
    } else if (tramite === "Transacciones") {
        dynamicFields.innerHTML = `
            <label for="tipoTransaccion">Tipo de Transacción:</label>
            <select id="tipoTransaccion" required>
                <option value="" disabled selected>Seleccionar Tipo</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Retiro">Retiro</option>
                <option value="Pago">Pago</option>
            </select>
            <label for="montoTransaccion">Monto:</label>
            <input type="number" id="montoTransaccion" placeholder="Monto" required>
            <label for="cuentaOrigen">Cuenta de Origen:</label>
            <input type="text" id="cuentaOrigen" placeholder="Cuenta de Origen">
            <label for="cuentaDestino">Cuenta de Destino:</label>
            <input type="text" id="cuentaDestino" placeholder="Cuenta de Destino">
        `;
    } else if (tramite === "Préstamos") {
        dynamicFields.innerHTML = `
            <label for="tipoPrestamo">Tipo de Préstamo:</label>
            <input type="text" id="tipoPrestamo" placeholder="Tipo de Préstamo" required>
            <label for="montoSolicitado">Monto Solicitado:</label>
            <input type="number" id="montoSolicitado" placeholder="Monto Solicitado" required>
            <label for="estadoPrestamo">Estado del Préstamo:</label>
            <select id="estadoPrestamo" required>
                <option value="" disabled selected>Seleccionar Estado</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Rechazado">Rechazado</option>
            </select>
        `;
    } else if (tramite === "Cajas de Seguridad") {
        dynamicFields.innerHTML = `
            <label for="numeroCaja">Número de Caja:</label>
            <input type="text" id="numeroCaja" placeholder="Número de Caja" required>
            <label for="fechaInicio">Fecha de Inicio:</label>
            <input type="date" id="fechaInicio" required>
            <label for="fechaVencimiento">Fecha de Vencimiento:</label>
            <input type="date" id="fechaVencimiento" required>
        `;
    } else if (tramite === "Pagos") {
        dynamicFields.innerHTML = `
            <label for="tipoPago">Tipo de Pago:</label>
            <select id="tipoPago" required>
                <option value="" disabled selected>Seleccionar Tipo</option>
                <option value="Servicios">Servicios</option>
                <option value="Tarjetas">Tarjetas</option>
                <option value="Préstamos">Préstamos</option>
            </select>
            <label for="montoPago">Monto:</label>
            <input type="number" id="montoPago" placeholder="Monto" required>
        `;
    } else if (tramite === "Asesorías Financieras") {
        dynamicFields.innerHTML = `
            <label for="tipoAsesoria">Tipo de Asesoría:</label>
            <input type="text" id="tipoAsesoria" placeholder="Tipo de Asesoría" required>
            <label for="ejecutivoAsignado">Ejecutivo Asignado:</label>
            <input type="text" id="ejecutivoAsignado" placeholder="Ejecutivo Asignado" required>
        `;
    }
});

window.verTramite = function (atencion) {
    const detalleTramite = document.getElementById("detalleTramite");
    detalleTramite.innerHTML = `
        <p><strong>Cliente:</strong> ${atencion.cliente}</p>
        <p><strong>Trámite:</strong> ${atencion.tramite}</p>
        <p><strong>Fecha:</strong> ${atencion.fecha}</p>
        <p><strong>Estado:</strong> ${atencion.estado}</p>
    `;

    if (atencion.tramite === "Depósitos") {
        detalleTramite.innerHTML += `
            <p><strong>Número de Cuenta:</strong> ${atencion.numeroCuenta}</p>
            <p><strong>Monto Depositado:</strong> ${atencion.montoDepositado}</p>
            <p><strong>Método de Depósito:</strong> ${atencion.metodoDeposito}</p>
        `;
    } else if (atencion.tramite === "Transacciones") {
        detalleTramite.innerHTML += `
            <p><strong>Tipo de Transacción:</strong> ${atencion.tipoTransaccion}</p>
            <p><strong>Monto:</strong> ${atencion.montoTransaccion}</p>
            <p><strong>Cuenta de Origen:</strong> ${atencion.cuentaOrigen || "N/A"}</p>
            <p><strong>Cuenta de Destino:</strong> ${atencion.cuentaDestino || "N/A"}</p>
        `;
    } else if (atencion.tramite === "Préstamos") {
        detalleTramite.innerHTML += `
            <p><strong>Tipo de Préstamo:</strong> ${atencion.tipoPrestamo}</p>
            <p><strong>Monto Solicitado:</strong> ${atencion.montoSolicitado}</p>
            <p><strong>Estado del Préstamo:</strong> ${atencion.estadoPrestamo}</p>
        `;
    } else if (atencion.tramite === "Cajas de Seguridad") {
        detalleTramite.innerHTML += `
            <p><strong>Número de Caja:</strong> ${atencion.numeroCaja}</p>
            <p><strong>Fecha de Inicio:</strong> ${atencion.fechaInicio}</p>
            <p><strong>Fecha de Vencimiento:</strong> ${atencion.fechaVencimiento}</p>
        `;
    } else if (atencion.tramite === "Pagos") {
        detalleTramite.innerHTML += `
            <p><strong>Tipo de Pago:</strong> ${atencion.tipoPago}</p>
            <p><strong>Monto:</strong> ${atencion.montoPago}</p>
        `;
    } else if (atencion.tramite === "Asesorías Financieras") {
        detalleTramite.innerHTML += `
            <p><strong>Tipo de Asesoría:</strong> ${atencion.tipoAsesoria}</p>
            <p><strong>Ejecutivo Asignado:</strong> ${atencion.ejecutivoAsignado}</p>
        `;
    }

    document.getElementById("modalVer").style.display = "flex";
};

window.cerrarModalVer = function () {
    document.getElementById("modalVer").style.display = "none";
};

function mostrarAtenciones() {
    onSnapshot(atencionesRef, (snapshot) => {
        let tbody = document.getElementById("listaAtenciones");
        tbody.innerHTML = "";

        snapshot.forEach((doc) => {
            let atencion = doc.data();
            let row = `<tr>
                <td>${atencion.cliente}</td>
                <td>${atencion.tramite}</td>
                <td>${atencion.fecha}</td>
                <td>${atencion.estado}</td>
                <td>
                    <button onclick="verTramite(${JSON.stringify(atencion).replace(/"/g, '&quot;')})">🔍</button>
                    <button onclick="editarAtencion('${doc.id}', '${atencion.cliente}', '${atencion.tramite}', '${atencion.fecha}', '${atencion.estado}')">Editar</button>
                    <button onclick="eliminarAtencion('${doc.id}')">Eliminar</button>
                </td>
            </tr>`;
            tbody.innerHTML += row;
        });
    });
}

window.eliminarAtencion = async function (id) {
    try {
        await deleteDoc(doc(db, "atenciones", id));
    } catch (error) {
        console.error("Error al eliminar la atención:", error);
    }
};

window.editarAtencion = function (id, cliente, tramite, fecha, estado) {
    idEdicion = id;
    document.getElementById("editCliente").value = cliente;
    document.getElementById("editTramite").value = tramite;
    document.getElementById("editFecha").value = fecha;
    document.getElementById("editEstado").value = estado;
    document.getElementById("modalEditar").style.display = "flex";
};

document.getElementById("guardarCambios").addEventListener("click", async function () {
    let cliente = document.getElementById("editCliente").value;
    let tramite = document.getElementById("editTramite").value;
    let fecha = document.getElementById("editFecha").value;
    let estado = document.getElementById("editEstado").value;

    try {
        await updateDoc(doc(db, "atenciones", idEdicion), {
            cliente,
            tramite,
            fecha,
            estado
        });
        cerrarModal();
    } catch (error) {
        console.error("Error al actualizar la atención:", error);
    }
});

window.cerrarModal = function () {
    document.getElementById("modalEditar").style.display = "none";
};

mostrarAtenciones();
