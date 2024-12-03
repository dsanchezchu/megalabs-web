// src/services/AuthService.js
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

const logout = async (navigate) => {
    try {
        await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    } finally {
        // Limpiar localStorage
        localStorage.clear();
        // Redirigir al login
        navigate('/login');
    }
};

export default logout;
