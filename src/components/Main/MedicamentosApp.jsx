import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MedicamentosApp.css";
import { API_BASE_URL } from "../../config/apiConfig";

const MedicamentosApp = () => {
    const [medicamentos, setMedicamentos] = useState([]);
    const [nuevoMedicamento, setNuevoMedicamento] = useState({ nombre: "", cantidad: 0 });
    const [seccionActiva, setSeccionActiva] = useState("listar"); // "listar", "crear", "reporte"

    // Cargar medicamentos en stock
    const cargarMedicamentos = () => {
        axios
            .get(`${API_BASE_URL}/medicamentos/stock`, { headers: { Authorization: "Bearer <token>" } })
            .then((response) => setMedicamentos(response.data))
            .catch((error) => console.error("Error al cargar medicamentos:", error));
    };

    useEffect(() => {
        cargarMedicamentos();
    }, []);

    // Manejar cambios en el formulario
    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setNuevoMedicamento({ ...nuevoMedicamento, [name]: value });
    };

    // Crear un nuevo medicamento
    const crearMedicamento = (e) => {
        e.preventDefault();
        axios
            .post(`${API_BASE_URL}/medicamentos/crear`, nuevoMedicamento, {
                headers: { Authorization: "Bearer <token>" },
            })
            .then(() => {
                alert("Medicamento creado con éxito");
                cargarMedicamentos();
                setNuevoMedicamento({ nombre: "", cantidad: 0 });
                setSeccionActiva("listar");
            })
            .catch((error) => console.error("Error al crear medicamento:", error));
    };

    // Generar reporte PDF
    const generarReporte = () => {
        axios
            .get(`${API_BASE_URL}/medicamentos/reporte`, {
                headers: { Authorization: "Bearer <token>" },
                responseType: "blob",
            })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "reporte_medicamentos.pdf");
                document.body.appendChild(link);
                link.click();
            })
            .catch((error) => console.error("Error al generar reporte:", error));
    };

    return (
        <div className="app-container">
            <nav>
                <ul className="menu">
                    <li
                        className={seccionActiva === "listar" ? "activo" : ""}
                        onClick={() => setSeccionActiva("listar")}
                    >
                        Lista de Medicamentos
                    </li>
                    <li
                        className={seccionActiva === "crear" ? "activo" : ""}
                        onClick={() => setSeccionActiva("crear")}
                    >
                        Crear Medicamento
                    </li>
                    <li
                        className={seccionActiva === "reporte" ? "activo" : ""}
                        onClick={() => setSeccionActiva("reporte")}
                    >
                        Generar Reporte
                    </li>
                </ul>
            </nav>

            <div className="contenido">
                {seccionActiva === "listar" && (
                    <div>
                        <h1>Medicamentos en Stock</h1>
                        <button onClick={cargarMedicamentos}>Actualizar Lista</button>
                        <ul>
                            {medicamentos.map((med) => (
                                <li key={med.id}>
                                    {med.nombre} - Cantidad: {med.cantidad}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {seccionActiva === "crear" && (
                    <div>
                        <h1>Crear Medicamento</h1>
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
                            <button type="submit">Crear</button>
                        </form>
                    </div>
                )}

                {seccionActiva === "reporte" && (
                    <div>
                        <h1>Generar Reporte</h1>
                        <button onClick={generarReporte}>Descargar Reporte PDF</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MedicamentosApp;