import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import "./MedicamentosApp.css";
import { API_BASE_URL } from '../../config/apiConfig';

const MedicamentosApp = () => {
    const [medicamentos, setMedicamentos] = useState([]);
    const [nuevoMedicamento, setNuevoMedicamento] = useState({ nombre: "", cantidad: 0 });

    // Función para cargar medicamentos
    const cargarMedicamentos = () => {
        axios
            .get(`${API_BASE_URL}/medicamentos/stock`, { headers: { Authorization: "Bearer <token>" } })
            .then((response) => setMedicamentos(response.data))
            .catch((error) => console.error("Error al cargar medicamentos:", error));
    };

    useEffect(() => {
        cargarMedicamentos();
    }, []);

    // Función para manejar la creación de medicamentos
    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setNuevoMedicamento({ ...nuevoMedicamento, [name]: value });
    };

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
            })
            .catch((error) => console.error("Error al crear medicamento:", error));
    };

    // Función para generar el reporte
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
        <Router>
            <div className="app-container">
                <nav>
                    <ul>
                        <li><Link to="/">Lista de Medicamentos</Link></li>
                        <li><Link to="/crear">Crear Medicamento</Link></li>
                        <li><Link to="/reporte">Generar Reporte</Link></li>
                    </ul>
                </nav>

                <Routes>
                    <Route
                        path="/"
                        element={
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
                        }
                    />
                    <Route
                        path="/crear"
                        element={
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
                        }
                    />
                    <Route
                        path="/reporte"
                        element={
                            <div>
                                <h1>Generar Reporte</h1>
                                <button onClick={generarReporte}>Descargar Reporte PDF</button>
                            </div>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default MedicamentosApp;