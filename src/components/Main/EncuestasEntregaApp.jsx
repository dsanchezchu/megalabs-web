import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./EncuestasEntregaApp.css";
import { API_BASE_URL } from '../../config/apiConfig';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EncuestasEntregaApp = () => {
    const [encuestas, setEncuestas] = useState([]);
    const [nuevaEncuesta, setNuevaEncuesta] = useState({
        puntualidadEntrega: 0,
        estadoProducto: 0,
        profesionalismoPersonal: 0,
        facilidadContacto: 0,
        comentarios: "",
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
        setNuevaEncuesta({
            ...nuevaEncuesta,
            [name]: name === "comentarios" ? value : parseFloat(value),
        });
    };

    const validarFormulario = () => {
        const { puntualidadEntrega, estadoProducto, profesionalismoPersonal, facilidadContacto } = nuevaEncuesta;
        // Verifica que los valores estén entre 0 y 5, y que sean múltiplos de 1
        if (
            [puntualidadEntrega, estadoProducto, profesionalismoPersonal, facilidadContacto].some(
                (v) => v < 0 || v > 5 || v % 1 !== 0
            )
        ) {
            setError("Todos los valores deben estar entre 0 y 5, y deben ser enteros.");
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
                    comentarios: "",
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

    const datosGrafico = {
        labels: reporte ? Object.keys(reporte) : [],
        datasets: [
            {
                label: "Promedio",
                data: reporte ? Object.values(reporte) : [],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
                borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
                borderWidth: 1,
            },
        ],
    };

    const opcionesGrafico = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Reporte de Promedios de Encuestas" },
        },
        scales: {
            y: { beginAtZero: true, max: 5 },
        },
    };

    return (
        <div className="encuestas-app">
            <h1>Encuestas de Entrega</h1>

            {error && <p className="error-message">{error}</p>}

            <div className="form-section">
                <h2>Registrar Nueva Encuesta</h2>
                <div className="form-container">
                    <form onSubmit={crearEncuesta}>
                        <label>
                            Puntualidad de Entrega:
                            <input
                                type="number"
                                name="puntualidadEntrega"
                                value={nuevaEncuesta.puntualidadEntrega}
                                min="0"
                                max="5"
                                step="1"
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
                                step="1"
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
                                step="1"
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
                                step="1"
                                onChange={manejarCambio}
                                required
                            />
                        </label>
                        <label>
                            Comentarios:
                            <textarea
                                name="comentarios"
                                value={nuevaEncuesta.comentarios || ""}
                                onChange={manejarCambio}
                                placeholder="Escribe tus comentarios aquí..."
                                rows="4"
                                required
                            />
                        </label>
                        <button type="submit">Registrar Encuesta</button>
                    </form>
                </div>
            </div>

            <div className="table-section">
                <h2>Listado de Encuestas</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Puntualidad</th>
                        <th>Estado</th>
                        <th>Profesionalismo</th>
                        <th>Facilidad</th>
                        <th>Comentarios</th>
                    </tr>
                    </thead>
                    <tbody>
                    {encuestas.map((encuesta, index) => (
                        <tr key={index}>
                            <td>{encuesta.puntualidadEntrega}</td>
                            <td>{encuesta.estadoProducto}</td>
                            <td>{encuesta.profesionalismoPersonal}</td>
                            <td>{encuesta.facilidadContacto}</td>
                            <td>{encuesta.comentarios || "Sin comentarios"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="report-section">
                <h2>Reporte Promedios</h2>
                <button onClick={generarReporte}>Generar Reporte</button>
                {reporte && (
                    <div>
                        <Bar data={datosGrafico} options={opcionesGrafico}/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EncuestasEntregaApp;