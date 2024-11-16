// src/services/AuthService.js
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

const logout = (navigate) => {
    axios.post(`${API_BASE_URL}/auth/logout`, {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(() => {
            localStorage.removeItem('token');
            navigate('/login'); // Usa el navigate pasado como parámetro
        })
        .catch(error => {
            console.error("Error al cerrar sesión:", error);
        });
};

export default logout;
