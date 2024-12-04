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
        comentarios: "", // Nuevo campo
    });
    const [reporte, setReporte] = useState(null);
    const [error, setError] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [searchQuery, setSearchQuery] = useState("");

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

    // Ordenar encuestas dinámicamente
    const ordenarEncuestas = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
        const sortedData = [...encuestas].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });
        setEncuestas(sortedData);
    };

    // Filtrar encuestas por la búsqueda
    const encuestasFiltradas = encuestas.filter((encuesta) => {
        const query = searchQuery.toLowerCase();
        return (
            encuesta.puntualidadEntrega.toString().includes(query) ||
            encuesta.estadoProducto.toString().includes(query) ||
            encuesta.profesionalismoPersonal.toString().includes(query) ||
            encuesta.facilidadContacto.toString().includes(query)
        );
    });

    // Configuración del gráfico
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

            <div className="search-section">
                <h2>Buscar Encuestas</h2>
                <input
                    type="text"
                    placeholder="Buscar por puntuaciones..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="table-section">
                <h2>Listado de Encuestas</h2>
                <table>
                    <thead>
                    <tr>
                        <th onClick={() => ordenarEncuestas("puntualidadEntrega")}>Puntualidad</th>
                        <th onClick={() => ordenarEncuestas("estadoProducto")}>Estado</th>
                        <th onClick={() => ordenarEncuestas("profesionalismoPersonal")}>Profesionalismo</th>
                        <th onClick={() => ordenarEncuestas("facilidadContacto")}>Facilidad</th>
                        <th>Comentarios</th> {/* Nuevo encabezado */}
                    </tr>
                    </thead>
                    <tbody>
                    {encuestasFiltradas.map((encuesta, index) => (
                        <tr key={index}>
                            <td>{encuesta.puntualidadEntrega}</td>
                            <td>{encuesta.estadoProducto}</td>
                            <td>{encuesta.profesionalismoPersonal}</td>
                            <td>{encuesta.facilidadContacto}</td>
                            <td>{encuesta.comentarios || "Sin comentarios"}</td>
                            {/* Mostrar comentarios */}
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