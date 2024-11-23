import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import './Medicamentos.css';
import { API_BASE_URL } from '../../config/apiConfig';

const Medicamentos = () => {
    const [medicamentos, setMedicamentos] = useState([]);
    const [nuevoMedicamento, setNuevoMedicamento] = useState({
        nombre: "",
        stock: 0,
    });
    const [mensaje, setMensaje] = useState("");

    const obtenerMedicamentosEnStock = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/medicamentos/stock`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setMedicamentos(response.data);
        } catch (error) {
            console.error("Error al obtener medicamentos en stock:", error);
        }
    };

    const generarReporte = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/medicamentos/stock`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "reporte_medicamentos.pdf");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error al generar reporte:", error);
        }
    };

    const crearMedicamento = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                `${API_BASE_URL}/medicamentos/stock`,
                nuevoMedicamento,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            setMensaje("Medicamento creado exitosamente.");
            setNuevoMedicamento({ nombre: "", stock: 0 });
            obtenerMedicamentosEnStock();
        } catch (error) {
            console.error("Error al crear medicamento:", error);
            setMensaje("Error al crear medicamento.");
        }
    };

    useEffect(() => {
        obtenerMedicamentosEnStock();
    }, []);

    return (
        <div className="medicamentos-container">
            <h1 className="titulo">Gestión de Medicamentos</h1>

            <section className="cuadro">
                <h2 className="subtitulo">Medicamentos en Stock</h2>
                <ul className="lista-medicamentos">
                    {medicamentos.map((med) => (
                        <li key={med.id} className="medicamento-item">
                            <span className="medicamento-nombre">{med.nombre}</span> -
                            <span className="medicamento-stock">Stock: {med.stock}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="cuadro">
                <h2 className="subtitulo">Generar Reporte</h2>
                <button className="boton" onClick={generarReporte}>Generar Reporte</button>
            </section>

            <section className="cuadro">
                <h2 className="subtitulo">Crear Nuevo Medicamento</h2>
                <form onSubmit={crearMedicamento}>
                    <div className="campo-formulario">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={nuevoMedicamento.nombre}
                            onChange={(e) =>
                                setNuevoMedicamento({ ...nuevoMedicamento, nombre: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="campo-formulario">
                        <label>Stock:</label>
                        <input
                            type="number"
                            value={nuevoMedicamento.stock}
                            onChange={(e) =>
                                setNuevoMedicamento({ ...nuevoMedicamento, stock: +e.target.value })
                            }
                            required
                        />
                    </div>
                    <button className="boton" type="submit">Crear</button>
                </form>
                {mensaje && <p className="mensaje">{mensaje}</p>}
            </section>
        </div>
    );
};

export default Medicamentos;