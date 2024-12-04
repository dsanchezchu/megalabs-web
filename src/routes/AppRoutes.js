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
import NotificationRepresentanteMain from "../components/Main/NotificationRepresentanteMain";
import MedicamentosApp from "../components/Main/MedicamentosApp";
import EncuestasEntregaApp from "../components/Main/EncuestasEntregaApp";
import EncuestasRecojoApp from "../components/Main/EncuestasRecojoApp";
import HistorialVisitasApp from "../components/Main/HistorialVisitasApp";
import PasswordRecoveryPage from "../pages/PasswordRecoveryPage";
import EstudiosClinicosPage from "../pages/EstudiosClinicosPage";

function AppRoutes() {
    return (
        <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/passwordrecovery" element={<PasswordRecoveryPage />} />
            {/* Rutas protegidas del Dashboard */}
            <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
                <Route path="" element={<DashboardPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="schedule" element={<SchedulePage />} />
                <Route path="report" element={<ReportPage />} />
                <Route path="notification" element={<NotificationPage />} />
                <Route path="medicalSample" element={<MedicalSamplesPage />} />
                <Route path="notifications" element={<NotificationRepresentanteMain />} />
                <Route path="medicamentos" element={<MedicamentosApp/>} />
                <Route path="encuestasentrega" element={<EncuestasEntregaApp/>} />
                <Route path="encuestasrecojo" element={<EncuestasRecojoApp/>} />
                <Route path="historialvisitas" element={<HistorialVisitasApp/>} />
                <Route path="estudiosclinicos" element={<EstudiosClinicosPage />} />
            </Route>

            {/* Redirigir al login si no encuentra la ruta */}
            <Route path="*" element={<LoginPage />} />
        </Routes>
    );
}

export default AppRoutes;
