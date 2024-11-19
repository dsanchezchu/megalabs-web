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
export const actualizarCita = async (id, citaData) => {
    const response = await fetch(`/api/citas/${id}/actualizar`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(citaData), // Asegurar que los datos se envían como JSON
    });

    if (!response.ok) {
        throw new Error("Error al actualizar la cita");
    }

    return response.json(); // Devolver la cita actualizada
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
        return response.data; // Devuelve un array de CitaDTO
    } catch (error) {
        console.error('Error al obtener las citas del representante:', error);
        throw error;
    }
};
