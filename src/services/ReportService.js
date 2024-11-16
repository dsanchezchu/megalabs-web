// src/services/reportService.js
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

export const getAuditReports = () => {
    return axios.get(`${API_BASE_URL}/reportes/auditoria-interna/todos`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
};

export const getComplianceReports = () => {
    return axios.get(`${API_BASE_URL}/reportes/cumplimiento-regulatorio/todos`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
};
