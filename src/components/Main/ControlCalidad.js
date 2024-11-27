import React, { useState } from 'react';
import './ControlCalidad.css';
import { API_BASE_URL } from '../../config/apiConfig';

function ControlCalidad() {
    const [producto, setProducto] = useState('');
    const [cliente, setCliente] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [resultados, setResultados] = useState([]);

    const buscarEstudios = async () => {
        const queryParams = new URLSearchParams();

        if (producto) queryParams.append('producto', producto);
        if (cliente) queryParams.append('cliente', cliente);
        if (fechaInicio && fechaFin) {
            queryParams.append('fechaInicio', fechaInicio);
            queryParams.append('fechaFin', fechaFin);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/control-calidad/buscar/estudios`);
            if (response.ok) {
                const data = await response.json();
                setResultados(data);
            } else {
                console.error('Error al buscar estudios:', response.statusText);
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    };

    return (
        <div>
            <h1>Control de Calidad - Búsqueda de Estudios Clínicos</h1>
            <form>
                <label>
                    Producto:
                    <input
                        type="text"
                        value={producto}
                        onChange={(e) => setProducto(e.target.value)}
                    />
                </label>
                <label>
                    Cliente:
                    <input
                        type="text"
                        value={cliente}
                        onChange={(e) => setCliente(e.target.value)}
                    />
                </label>
                <label>
                    Fecha Inicio:
                    <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                    />
                </label>
                <label>
                    Fecha Fin:
                    <input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                    />
                </label>
                <button type="button" onClick={buscarEstudios}>Buscar</button>
            </form>

            <div className="resultados">
                <h2>Resultados</h2>
                <ul>
                    {resultados.length > 0 ? (
                        resultados.map((estudio, index) => (
                            <li key={index}>
                                <strong>ID:</strong> {estudio.id} | <strong>Producto:</strong> {estudio.producto} | <strong>Cliente:</strong> {estudio.cliente} | <strong>Fecha:</strong> {estudio.fecha}
                            </li>
                        ))
                    ) : (
                        <p>No se encontraron estudios con los criterios seleccionados.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default ControlCalidad;