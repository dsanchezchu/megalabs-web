// src/services/ProductoService.js
import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

// Obtener todos los productos
export const fetchProductos = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/productos/todos`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener productos:", error);
        throw error;
    }
};
