import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import OrdersPage from '../pages/OrdersPage';
import SchedulePage from '../pages/SchedulePage';
import PrivateRoute from '../routes/PrivateRoute';

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Rutas protegidas */}
                <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
                <Route path="/schedule" element={<PrivateRoute><SchedulePage /></PrivateRoute>} />

                {/* Redirigir a login si la ruta no se encuentra */}
                <Route path="*" element={<LoginPage />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;

