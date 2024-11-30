import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EncuestasEntregaApp.css";
import { API_BASE_URL } from '../../config/apiConfig';

const EncuestasEntregaApp = () => {
    const [encuestas, setEncuestas] = useState([]);
    const [nuevaEncuesta, setNuevaEncuesta] = useState({
        puntualidadEntrega: 0,
        estadoProducto: 0,
        profesionalismoPersonal: 0,
        facilidadContacto: 0,
    });
    const [reporte, setReporte] = useState(null);

    // Función para cargar las encuestas
    const cargarEncuestas = () => {
        axios
            .get(`${API_BASE_URL}/api/encuestas-entrega`, { headers: { Authorization: "Bearer <token>" } })
            .then((response) => setEncuestas(response.data))
            .catch((error) => console.error("Error al cargar encuestas:", error));
    };

    useEffect(() => {
        cargarEncuestas();
    }, []);

    // Función para manejar cambios en el formulario
    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setNuevaEncuesta({ ...nuevaEncuesta, [name]: parseFloat(value) });
    };

    // Función para enviar una nueva encuesta
    const crearEncuesta = (e) => {
        e.preventDefault();
        axios
            .post(`${API_BASE_URL}/api/encuestas-entrega`, nuevaEncuesta, {
                headers: { Authorization: "Bearer <token>" },
            })
            .then(() => {
                alert("Encuesta creada con éxito");
                cargarEncuestas();
                setNuevaEncuesta({
                    puntualidadEntrega: 0,
                    estadoProducto: 0,
                    profesionalismoPersonal: 0,
                    facilidadContacto: 0,
                });
            })
            .catch((error) => console.error("Error al crear encuesta:", error));
    };

    // Función para obtener el reporte
    const generarReporte = () => {
        axios
            .get(`${API_BASE_URL}/api/encuestas-entrega/reporte`, { headers: { Authorization: "Bearer <token>" } })
            .then((response) => setReporte(response.data))
            .catch((error) => console.error("Error al generar reporte:", error));
    };

    return (
        <div className="encuestas-app">
            <h1>Encuestas de Entrega</h1>

            <div className="form-section">
                <h2>Registrar Nueva Encuesta</h2>
                <form onSubmit={crearEncuesta}>
                    <label>
                        Puntualidad de Entrega:
                        <input
                            type="number"
                            name="puntualidadEntrega"
                            value={nuevaEncuesta.puntualidadEntrega}
                            min="0"
                            max="5"
                            step="0.1"
                            onChange={manejarCambio}
                            required
                        />
                    </label>
                    <label>
                        Estado del Producto:
                        <input
                            type="number"
                            name="estadoProducto"
                            value={nuevaEncuesta.estadoProducto}
                            min="0"
                            max="5"
                            step="0.1"
                            onChange={manejarCambio}
                            required
                        />
                    </label>
                    <label>
                        Profesionalismo del Personal:
                        <input
                            type="number"
                            name="profesionalismoPersonal"
                            value={nuevaEncuesta.profesionalismoPersonal}
                            min="0"
                            max="5"
                            step="0.1"
                            onChange={manejarCambio}
                            required
                        />
                    </label>
                    <label>
                        Facilidad de Contacto:
                        <input
                            type="number"
                            name="facilidadContacto"
                            value={nuevaEncuesta.facilidadContacto}
                            min="0"
                            max="5"
                            step="0.1"
                            onChange={manejarCambio}
                            required
                        />
                    </label>
                    <button type="submit">Registrar Encuesta</button>
                </form>
            </div>

            <div className="list-section">
                <h2>Listado de Encuestas</h2>
                <ul>
                    {encuestas.map((encuesta, index) => (
                        <li key={index}>
                            <strong>Puntualidad:</strong> {encuesta.puntualidadEntrega} |{" "}
                            <strong>Estado:</strong> {encuesta.estadoProducto} |{" "}
                            <strong>Profesionalismo:</strong> {encuesta.profesionalismoPersonal} |{" "}
                            <strong>Facilidad:</strong> {encuesta.facilidadContacto}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="report-section">
                <h2>Reporte Promedios</h2>
                <button onClick={generarReporte}>Generar Reporte</button>
                {reporte && (
                    <ul>
                        {Object.entries(reporte).map(([key, value]) => (
                            <li key={key}>
                                <strong>{key}:</strong> {value.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default EncuestasEntregaApp;