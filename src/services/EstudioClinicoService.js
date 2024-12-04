// src/services/EstudioClinicoService.js
import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

// Obtener métodos analíticos
export const fetchMetodosAnaliticos = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/metodoAnalitico/listarTodos`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener métodos analíticos:', error);
        throw error;
    }
};


// Buscar estudios clínicos
export const buscarEstudios = async (params) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/control-calidad/buscar/estudios`, {
            params,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error al buscar estudios clínicos:", error);
        throw error;
    }
};

// Registrar un estudio clínico
export const registrarEstudioClinico = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/control-calidad/registrar/estudio-clinico`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error al registrar el estudio clínico:", error);
        throw error;
    }
};

// Actualizar un estudio clínico
export const actualizarEstudioClinico = async (idControl, data) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/control-calidad/actualizar`, {
            ...data,
            idControl
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el estudio clínico:", error);
        throw error;
    }
};