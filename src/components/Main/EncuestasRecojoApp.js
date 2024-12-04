import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./EncuestasRocojoApp.css";
import { API_BASE_URL } from '../../config/apiConfig';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EncuestasRecojoApp = () => {
    const [encuestas, setEncuestas] = useState([]);
    const [nuevaEncuesta, setNuevaEncuesta] = useState({
        puntualidadRecojo: 0,
        estadoProducto: 0,
        amabilidadPersonal: 0,
        claridadInstrucciones: 0,
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
            .get(`${API_BASE_URL}/api/encuestas-recojo`, { headers: { Authorization: `Bearer ${token}` } })
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
        const { puntualidadRecojo, estadoProducto, amabilidadPersonal, claridadInstrucciones } = nuevaEncuesta;
        // Verifica que los valores estén entre 0 y 5, y que sean múltiplos de 1
        if (
            [puntualidadRecojo, estadoProducto, amabilidadPersonal, claridadInstrucciones].some(
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
            .post(`${API_BASE_URL}/api/encuestas-recojo`, nuevaEncuesta, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                alert("Encuesta creada con éxito");
                cargarEncuestas();
                setNuevaEncuesta({
                    puntualidadRecojo: 0,
                    estadoProducto: 0,
                    amabilidadPersonal: 0,
                    claridadInstrucciones: 0,
                    comentarios: "",
                });
            })
            .catch((error) => console.error("Error al crear encuesta:", error));
    };

    const generarReporte = () => {
        const token = validarToken();
        if (!token) return;

        axios
            .get(`${API_BASE_URL}/api/encuestas-recojo/reporte`, { headers: { Authorization: `Bearer ${token}` } })
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
            title: { display: true, text: "Reporte de Promedios de Encuestas de Recojo" },
        },
        scales: {
            y: { beginAtZero: true, max: 5 },
        },
    };

    return (
        <div className="encuestas-app">
            <h1>Encuestas de Recojo</h1>

            {error && <p className="error-message">{error}</p>}

            <div className="form-section">
                <h2>Registrar Nueva Encuesta</h2>
                <div className="form-container">
                    <form onSubmit={crearEncuesta}>
                        <label>
                            Puntualidad de Recojo:
                            <input
                                type="number"
                                name="puntualidadRecojo"
                                value={nuevaEncuesta.puntualidadRecojo}
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
                            Amabilidad del Personal:
                            <input
                                type="number"
                                name="amabilidadPersonal"
                                value={nuevaEncuesta.amabilidadPersonal}
                                min="0"
                                max="5"
                                step="1"
                                onChange={manejarCambio}
                                required
                            />
                        </label>
                        <label>
                            Claridad de Instrucciones:
                            <input
                                type="number"
                                name="claridadInstrucciones"
                                value={nuevaEncuesta.claridadInstrucciones}
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
                        <th>Amabilidad</th>
                        <th>Claridad</th>
                        <th>Comentarios</th>
                    </tr>
                    </thead>
                    <tbody>
                    {encuestas.map((encuesta, index) => (
                        <tr key={index}>
                            <td>{encuesta.puntualidadRecojo}</td>
                            <td>{encuesta.estadoProducto}</td>
                            <td>{encuesta.amabilidadPersonal}</td>
                            <td>{encuesta.claridadInstrucciones}</td>
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

export default EncuestasRecojoApp;