import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useEffect } from "react";

const Medicamentos = () => {
    const [medicamentos, setMedicamentos] = useState([]);
    const [nuevoMedicamento, setNuevoMedicamento] = useState({
        nombre: "",
        stock: 0,
    });
    const [mensaje, setMensaje] = useState("");

    const obtenerMedicamentosEnStock = async () => {
        try {
            const response = await axios.get("/medicamentos/stock", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setMedicamentos(response.data);
        } catch (error) {
            console.error("Error al obtener medicamentos en stock:", error);
        }
    };

    const generarReporte = async () => {
        try {
            const response = await axios.get("/medicamentos/reporte", {
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
                "/medicamentos/crear",
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
            obtenerMedicamentosEnStock(); // Actualizar lista
        } catch (error) {
            console.error("Error al crear medicamento:", error);
            setMensaje("Error al crear medicamento.");
        }
    };

    useEffect(() => {
        obtenerMedicamentosEnStock();
    }, []);

    return (
        <div>
            <h1>Gestión de Medicamentos</h1>

            {/* Mostrar medicamentos en stock */}
            <section>
                <h2>Medicamentos en Stock</h2>
                <ul>
                    {medicamentos.map((med) => (
                        <li key={med.id}>
                            {med.nombre} - Stock: {med.stock}
                        </li>
                    ))}
                </ul>
            </section>

            {/* Botón para generar reporte */}
            <section>
                <button onClick={generarReporte}>Generar Reporte</button>
            </section>

            {/* Formulario para crear un nuevo medicamento */}
            <section>
                <h2>Crear Nuevo Medicamento</h2>
                <form onSubmit={crearMedicamento}>
                    <div>
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
                    <div>
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
                    <button type="submit">Crear</button>
                </form>
                {mensaje && <p>{mensaje}</p>}
            </section>
        </div>
    );
};

export default Medicamentos;