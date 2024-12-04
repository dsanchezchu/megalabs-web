// src/services/ClientesService.js
import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

// Obtener clientes
export const fetchClientes = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/clientes`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        throw error;
    }
};