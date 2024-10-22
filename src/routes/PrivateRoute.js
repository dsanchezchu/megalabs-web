import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    // Si el token no está presente, redirige al login
    return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
