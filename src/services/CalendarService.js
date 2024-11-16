// src/services/calendarServices.js
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// Función para programar una cita
export const programarCita = async (nombreCliente, motivo, fechaHora) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/citas/programar`,
            new URLSearchParams({
                nombreCliente,
                motivo,
                fechaHora,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
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
            null,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error al cancelar la cita:', error);
        throw error;
    }
};
