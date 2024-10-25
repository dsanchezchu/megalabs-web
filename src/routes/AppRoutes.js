import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import OrdersPage from '../pages/OrdersPage';
import SchedulePage from '../pages/SchedulePage';
import PrivateRoute from '../routes/PrivateRoute';
import Sidebar from '../components/Sidebar/HomePageSidebar';

function AppRoutes() {
    return (
        <Router>
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-grow">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />

                        {/* Rutas protegidas */}
                        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                        <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
                        <Route path="/schedule" element={<PrivateRoute><SchedulePage /></PrivateRoute>} />

                        {/* Redirigir al login si no encuentra la ruta */}
                        <Route path="*" element={<LoginPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default AppRoutes;

