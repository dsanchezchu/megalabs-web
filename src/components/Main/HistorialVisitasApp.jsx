import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HistorialVisitasApp.css"; // Archivo CSS opcional para estilos personalizados
import { API_BASE_URL } from "../../config/apiConfig";

const HistorialVisitasApp = () => {
    const [entrevistas, setEntrevistas] = useState([]);
    const [error, setError] = useState("");

    // Obtener token desde localStorage
    const obtenerToken = () => localStorage.getItem("token");

    // Validar token
    const validarToken = () => {
        const token = obtenerToken();
        if (!token) {
            setError("Error: Token no encontrado. Por favor, inicie sesión nuevamente.");
            console.error("Token no encontrado.");
            return false;
        }
        return token;
    };

    // Cargar entrevistas desde el backend
    const cargarEntrevistas = () => {
        const token = validarToken();
        if (!token) return;

        axios
            .get(`${API_BASE_URL}/api/entrevistas`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setEntrevistas(response.data);
            })
            .catch((error) => {
                console.error("Error al cargar entrevistas:", error);
                setError("Error al cargar el historial de visitas.");
            });
    };

    // Cargar las entrevistas al montar el componente
    useEffect(() => {
        cargarEntrevistas();
    }, []);

    return (
        <div className="historial-visitas-app">
            <h1>Gestión de Historial de Visitas</h1> {/* Título actualizado */}

            {error && <p className="error-message">{error}</p>}

            <div className="table-section">
                <h2>Listado de Historial</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Lugar</th>
                            <th>Representante (DNI)</th>
                            <th>Cliente (RUC)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entrevistas.length > 0 ? (
                            entrevistas.map((entrevista, index) => (
                                <tr key={index}>
                                    <td>{entrevista.fecha}</td>
                                    <td>{entrevista.hora}</td>
                                    <td>{entrevista.lugarSede}</td>
                                    <td>{entrevista.representanteDni}</td> {/* Corregido */}
                                    <td>{entrevista.clienteRuc}</td> {/* Corregido */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center" }}>
                                    No hay entrevistas disponibles.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistorialVisitasApp;