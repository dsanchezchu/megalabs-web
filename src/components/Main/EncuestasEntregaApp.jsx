import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./EncuestasEntregaApp.css";
import { API_BASE_URL } from '../../config/apiConfig';

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EncuestasEntregaApp = () => {
    const [encuestas, setEncuestas] = useState([]);
    const [nuevaEncuesta, setNuevaEncuesta] = useState({
        puntualidadEntrega: 0,
        estadoProducto: 0,
        profesionalismoPersonal: 0,
        facilidadContacto: 0,
    });
    const [reporte, setReporte] = useState(null);
    const [error, setError] = useState("");

    const obtenerToken = () => localStorage.getItem("token");

    const validarToken = () => {
        const token = obtenerToken();
        if (!token) {
            setError("Error: Token no encontrado. Por favor, inicie sesión nuevamente.");
            console.error("Token no encontrado.");
            return false;
        }
        return token;
    };

    const cargarEncuestas = () => {
        const token = validarToken();
        if (!token) return;

        axios
            .get(`${API_BASE_URL}/api/encuestas-entrega`, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => setEncuestas(response.data))
            .catch((error) => console.error("Error al cargar encuestas:", error));
    };

    useEffect(() => {
        cargarEncuestas();
    }, []);

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setNuevaEncuesta({ ...nuevaEncuesta, [name]: parseFloat(value) });
    };

    const validarFormulario = () => {
        const { puntualidadEntrega, estadoProducto, profesionalismoPersonal, facilidadContacto } = nuevaEncuesta;
        if ([puntualidadEntrega, estadoProducto, profesionalismoPersonal, facilidadContacto].some((v) => v < 0 || v > 5)) {
            setError("Todos los valores deben estar entre 0 y 5.");
            return false;
        }
        setError("");
        return true;
    };

    const crearEncuesta = (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        const token = validarToken();
        if (!token) return;

        axios
            .post(`${API_BASE_URL}/api/encuestas-entrega`, nuevaEncuesta, {
                headers: { Authorization: `Bearer ${token}` },
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

    const generarReporte = () => {
        const token = validarToken();
        if (!token) return;

        axios
            .get(`${API_BASE_URL}/api/encuestas-entrega/reporte`, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => setReporte(response.data))
            .catch((error) => console.error("Error al generar reporte:", error));
    };

    // Configuración del gráfico
    const datosGrafico = {
        labels: reporte ? Object.keys(reporte) : [],
        datasets: [
            {
                label: "Promedio",
                data: reporte ? Object.values(reporte) : [],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",  // Rojo claro
                    "rgba(54, 162, 235, 0.2)",  // Azul claro
                    "rgba(255, 206, 86, 0.2)",  // Amarillo claro
                    "rgba(75, 192, 192, 0.2)",  // Verde claro
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",    // Rojo
                    "rgba(54, 162, 235, 1)",    // Azul
                    "rgba(255, 206, 86, 1)",    // Amarillo
                    "rgba(75, 192, 192, 1)",    // Verde
                ],
                borderWidth: 1,
            },
        ],
    };

    const opcionesGrafico = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Reporte de Promedios de Encuestas",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 5, // Ya que los valores están en una escala de 0 a 5
            },
        },
    };

    return (
        <div className="encuestas-app">
            <h1>Encuestas de Entrega</h1>

            {error && <p className="error-message">{error}</p>}

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
                    <div>
                        <Bar data={datosGrafico} options={opcionesGrafico} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default EncuestasEntregaApp;