// src/layouts/DashboardLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/DashboardPageSidebar'; // Asegúrate de que la ruta es correcta
import './DashboardStyle.css'

const DashboardLayout = () => {
    return (
        <div className="flex h-screen">
            <Sidebar /> {/* El Sidebar siempre estará aquí en el Dashboard */}
            <div className="flex-auto h-screen p-6 bg-gray-100 overflow-y-auto">
                <Outlet /> {/* Aquí se renderizarán las páginas específicas del Dashboard */}
            </div>
        </div>
    );
};

export default DashboardLayout;