// src/layouts/DashboardLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/DashboardPageSidebar'; // Asegúrate de que la ruta es correcta

const DashboardLayout = () => {
    return (
        <div className="flex h-screen">
            <Sidebar /> {/* El Sidebar siempre estará aquí en el Dashboard */}
            <div className="flex-grow p-6 bg-gray-100">
                <Outlet /> {/* Aquí se renderizarán las páginas específicas del Dashboard */}
            </div>
        </div>
    );
};

export default DashboardLayout;