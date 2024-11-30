import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RegistroEstudioClínico.css"

const RegistroEstudioClinico = () => {
    const [productos, setProductos] = useState([]); // Lista de productos
    const [metodosAnaliticos, setMetodosAnaliticos] = useState([]); // Lista de métodos analíticos
    const [formData, setFormData] = useState({
        productoId: "",
        fecha: "",
        resultado: "",
        metodosAnaliticosIds: [],
        documentacion: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Cargar datos iniciales (productos y métodos analíticos)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const productosResponse = await axios.get("/api/productos"); // Endpoint para obtener productos
                const metodosResponse = await axios.get("/api/metodos-analiticos"); // Endpoint para obtener métodos analíticos
                setProductos(productosResponse.data);
                setMetodosAnaliticos(metodosResponse.data);
            } catch (error) {
                console.error("Error al cargar datos iniciales:", error);
            }
        };

        fetchData();
    }, []);

    // Manejar cambios en los inputs del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Manejar cambios en los checkboxes (métodos analíticos)
    const handleCheckboxChange = (id) => {
        setFormData((prevData) => {
            const isChecked = prevData.metodosAnaliticosIds.includes(id);
            const updatedIds = isChecked
                ? prevData.metodosAnaliticosIds.filter((metodoId) => metodoId !== id)
                : [...prevData.metodosAnaliticosIds, id];
            return { ...prevData, metodosAnaliticosIds: updatedIds };
        });
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const response = await axios.post(
                "/control-calidad/registrar/estudio-clinico",
                formData
            );
            setMessage(response.data);
            setFormData({
                productoId: "",
                fecha: "",
                resultado: "",
                metodosAnaliticosIds: [],
                documentacion: "",
            });
        } catch (error) {
            console.error("Error al registrar el estudio clínico:", error);
            setMessage("Error al registrar el estudio clínico. Verifica los datos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registro-estudio-clinico">
            <h1>Registrar Estudio Clínico</h1>
            <form onSubmit={handleSubmit}>
                {/* Selección de producto */}
                <label>
                    Producto:
                    <select
                        name="productoId"
                        value={formData.productoId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona un producto</option>
                        {productos.map((producto) => (
                            <option key={producto.id} value={producto.id}>
                                {producto.nombre}
                            </option>
                        ))}
                    </select>
                </label>

                {/* Selección de fecha */}
                <label>
                    Fecha:
                    <input
                        type="date"
                        name="fecha"
                        value={formData.fecha}
                        onChange={handleChange}
                        required
                    />
                </label>

                {/* Resultado */}
                <label>
                    Resultado:
                    <textarea
                        name="resultado"
                        value={formData.resultado}
                        onChange={handleChange}
                        required
                    ></textarea>
                </label>

                {/* Selección de métodos analíticos */}
                <fieldset>
                    <legend>Métodos Analíticos:</legend>
                    {metodosAnaliticos.map((metodo) => (
                        <label key={metodo.id}>
                            <input
                                type="checkbox"
                                checked={formData.metodosAnaliticosIds.includes(metodo.id)}
                                onChange={() => handleCheckboxChange(metodo.id)}
                            />
                            {metodo.nombre}
                        </label>
                    ))}
                </fieldset>

                {/* Documentación */}
                <label>
                    Documentación:
                    <textarea
                        name="documentacion"
                        value={formData.documentacion}
                        onChange={handleChange}
                    ></textarea>
                </label>

                {/* Botón de enviar */}
                <button type="submit" disabled={loading}>
                    {loading ? "Registrando..." : "Registrar Estudio Clínico"}
                </button>
            </form>

            {/* Mensaje de éxito o error */}
            {message && <p>{message}</p>}
        </div>
    );
};

export default RegistroEstudioClinico;