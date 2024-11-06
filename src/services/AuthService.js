// src/services/AuthService.js
import axios from 'axios';

const logout = (navigate) => {
    axios.post('http://localhost:8080/api/v1/auth/logout', {}, {
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
