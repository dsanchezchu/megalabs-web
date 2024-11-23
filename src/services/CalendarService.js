import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// Función para programar una cita
export const programarCita = async (nombreCliente, motivo, fechaHora, dniRepresentante) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/citas/programar`,
            {
                nombreCliente,
                motivo,
                fechaHora,
                dniRepresentante,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error al programar la cita:', error);
        throw error;
    }
};

// Función para cancelar una cita
export const cancelarCita = async (id) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/citas/${id}/cancelar`,
            null, // No se necesita un cuerpo para cancelar
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error al cancelar la cita:', error);
        throw error;
    }
};

// Función para actualizar una cita
// Función para actualizar una cita
export const actualizarCita = async (id, citaData) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/citas/${id}/actualizar`,
            citaData, // Enviar los datos de la cita como cuerpo
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data; // Devolver la cita actualizada
    } catch (error) {
        console.error('Error al actualizar la cita:', error.response || error.message);
        throw error;
    }
};


// Función para obtener citas por representante
export const obtenerCitasPorRepresentante = async (dniRepresentante) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/citas/representante/${dniRepresentante}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("Datos recibidos de la API:", response.data);

        // Ajustar el mapeo para usar `clienteNombre`
        return response.data.map((cita) => ({
            ...cita,
            nombreCliente: cita.clienteNombre?.trim() || "Nombre no disponible", // Usar `clienteNombre`
        }));
    } catch (error) {
        console.error('Error al obtener las citas del representante:', error);
        throw error;
    }
};

