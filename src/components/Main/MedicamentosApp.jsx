import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";  // Para tablas dinámicas
import "./MedicamentosApp.css";
import { API_BASE_URL } from "../../config/apiConfig";

const MedicamentosApp = () => {
    const [medicamentos, setMedicamentos] = useState([]);
    const [nuevoMedicamento, setNuevoMedicamento] = useState({ nombre: "", cantidad: 0, laboratorio: "" });
    const [seccionActiva, setSeccionActiva] = useState("listar");
    const [error, setError] = useState("");

    const obtenerToken = () => localStorage.getItem("token");

    // Obtener nombre y DNI del representante
    const obtenerRepresentante = () => {
        const nombre = localStorage.getItem("nombre");
        const dni = localStorage.getItem("dni");
        return { nombre, dni };
    };

    // Cargar medicamentos en stock
    const cargarMedicamentos = () => {
        const token = obtenerToken();
        if (!token) {
            console.error("Token no encontrado.");
            return;
        }

        axios
            .get(`${API_BASE_URL}/medicamentos/stock`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => setMedicamentos(response.data))
            .catch((error) => console.error("Error al cargar medicamentos:", error));
    };

    useEffect(() => {
        cargarMedicamentos();
    }, []);

    // Manejo del formulario para creación de medicamento
    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setNuevoMedicamento({ ...nuevoMedicamento, [name]: value });
    };

    // Validación de formulario antes de enviar
    const validarFormulario = () => {
        const { nombre, cantidad, laboratorio } = nuevoMedicamento;
        if (!nombre || !cantidad || !laboratorio) {
            setError("Todos los campos son obligatorios.");
            return false;
        }
        setError("");
        return true;
    };

    // Crear medicamento
    const crearMedicamento = (e) => {
        e.preventDefault();
        if (!validarFormulario()) {
            return;
        }

        const token = obtenerToken();
        if (!token) {
            console.error("Token no encontrado.");
            return;
        }

        axios
            .post(`${API_BASE_URL}/medicamentos/crear`, nuevoMedicamento, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                alert("Medicamento creado con éxito");
                cargarMedicamentos();
                setNuevoMedicamento({ nombre: "", cantidad: 0, laboratorio: "" });
                setSeccionActiva("listar");
            })
            .catch((error) => console.error("Error al crear medicamento:", error));
    };

    // Generar reporte en PDF
    const generarReportePDF = () => {
        const { nombre, dni } = obtenerRepresentante();

        const doc = new jsPDF();
        const logoUrl = "https://i.imgur.com/y9fvifd.png"; // URL del logo

        // Agregar logo
        doc.addImage(logoUrl, "PNG", 10, 10, 50, 20);

        // Agregar encabezado
        doc.setFontSize(18);
        doc.text("Reporte de Medicamentos en Stock", 70, 20);
        
        // Agregar detalles del reporte
        doc.setFontSize(12);
        doc.text("Megalabs", 14, 40);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 45);
        doc.text(`Representante: ${nombre}`, 14, 50);
        doc.text(`DNI: ${dni}`, 14, 55);

        // Espacio antes de la tabla
        doc.autoTable({
            startY: 60,
            head: [['#', 'Nombre', 'Cantidad', 'Laboratorio']],
            body: medicamentos.map((med, index) => [
                index + 1,
                med.nombre,
                med.cantidad,
                med.laboratorio,
            ]),
            theme: 'grid', // Estilo de la tabla
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: [255, 255, 255],
                fontSize: 12,
                fontStyle: 'bold',
                halign: 'center',
            },
            bodyStyles: {
                fontSize: 10,
                textColor: [0, 0, 0],
            },
            styles: {
                overflow: 'linebreak',
                cellPadding: 3,
            },
            columnStyles: {
                0: { halign: 'center' },
                1: { halign: 'left' },
                2: { halign: 'center' },
                3: { halign: 'left' },
            },
            margin: { top: 10, right: 10, bottom: 10, left: 10 },
        });

        // Agregar pie de página
        doc.setFontSize(10);
        doc.text("@Megalabs 2024\n Feliz Navidad y Prospero Año Nuevo.", 14, doc.autoTableEndPosY() + 15);

        // Descargar el archivo PDF
        doc.save("reporte_medicamentos.pdf");
    };

    return (
        <div className="app-container">
            <header className="header">
                <div className="logo">Medicamentos App</div>
                <nav className="nav">
                    <ul>
                        <li className={seccionActiva === "listar" ? "active" : ""} onClick={() => setSeccionActiva("listar")}>Listar</li>
                        <li className={seccionActiva === "crear" ? "active" : ""} onClick={() => setSeccionActiva("crear")}>Crear</li>
                        <li className={seccionActiva === "reporte" ? "active" : ""} onClick={() => setSeccionActiva("reporte")}>Reporte</li>
                    </ul>
                </nav>
            </header>

            <div className="content">
                {seccionActiva === "listar" && (
                    <div className="tabla-container">
                        <h2>Medicamentos en Stock</h2>
                        <table className="tabla">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Cantidad</th>
                                    <th>Laboratorio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicamentos.map((med) => (
                                    <tr key={med.id}>
                                        <td>{med.nombre}</td>
                                        <td>{med.cantidad}</td>
                                        <td>{med.laboratorio}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {seccionActiva === "crear" && (
                    <div className="form-container">
                        <h2>Crear Medicamento</h2>
                        <form onSubmit={crearMedicamento}>
                            <input
                                type="text"
                                name="nombre"
                                value={nuevoMedicamento.nombre}
                                placeholder="Nombre del medicamento"
                                onChange={manejarCambio}
                                required
                            />
                            <input
                                type="number"
                                name="cantidad"
                                value={nuevoMedicamento.cantidad}
                                placeholder="Cantidad"
                                onChange={manejarCambio}
                                required
                            />
                            <input
                                type="text"
                                name="laboratorio"
                                value={nuevoMedicamento.laboratorio}
                                placeholder="Laboratorio"
                                onChange={manejarCambio}
                                required
                            />
                            <button type="submit">Crear</button>
                        </form>
                        {error && <p className="error-message">{error}</p>}
                    </div>
                )}

                {seccionActiva === "reporte" && (
                    <div className="reporte-container">
                        <h2>Generar Reporte PDF</h2>
                        <button onClick={generarReportePDF}>Descargar Reporte PDF</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MedicamentosApp;