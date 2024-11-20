// src/services/reportService.js
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// Reporte de ventas
export const getSalesReports = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/ventas/reporte`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response;
    } catch (error) {
        console.error('Error al obtener reportes de ventas:', error);
        throw error;
    }
};

// Reporte de auditorías internas
export const getAuditReports = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/reportes/auditoria-interna/todos`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response;
    } catch (error) {
        console.error('Error al obtener reportes de auditorías:', error);
        throw error;
    }
};

// Reporte de cumplimiento regulatorio
export const getComplianceReports = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/reportes/cumplimiento-regulatorio/todos`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response;
    } catch (error) {
        console.error('Error al obtener reportes de cumplimiento regulatorio:', error);
        throw error;
    }
};

