import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import OrdersPage from '../pages/OrdersPage';
import SchedulePage from '../pages/SchedulePage';
import PrivateRoute from '../routes/PrivateRoute';
import DashboardLayout from "../components/Layout/DashboardLayout";
import ReportPage from "../pages/ReportPage";
import NotificationPage from "../pages/NotificationPage";
import MedicalSamplesPage from "../pages/MedicalSamplesPage";

function AppRoutes() {
    return (
        <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Rutas protegidas del Dashboard */}
            <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
                <Route path="" element={<DashboardPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="schedule" element={<SchedulePage />} />
                <Route path="report" element={<ReportPage />} />
                <Route path="notification" element={<NotificationPage />} />
                <Route path="medicalSample" element={<MedicalSamplesPage />} />
            </Route>

            {/* Redirigir al login si no encuentra la ruta */}
            <Route path="*" element={<LoginPage />} />
        </Routes>
    );
}

export default AppRoutes;
