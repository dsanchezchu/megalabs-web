import React from 'react';
import { Link } from 'react-router-dom';
import {FaCalendarAlt, FaClipboardList, FaFileAlt, FaHome, FaBell} from "react-icons/fa";
import {FaFilePen} from "react-icons/fa6";

const DashboardPageSidebar = () => {
    const token = localStorage.getItem('token');

    if (!token) return null;  // No mostrar el sidebar si el usuario no está autenticado

    return (
        <aside className="w-1/5 bg-gray-800 text-white h-screen p-4">
            <div className="w-64 bg-gray-800 text-white h-screen flex flex-col">
                <div className="p-4 text-2xl font-bold border-b border-gray-700">
                    Dashboard
                </div>
                <nav className="flex-grow p-4 space-y-4">
                    <Link to="/dashboard" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
                        <FaHome className="text-xl"/> {/* Ícono de inicio */}
                        <span>Inicio</span>
                    </Link>
                    <Link to="/dashboard/orders" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
                        <FaClipboardList className="text-xl"/> {/* Ícono de órdenes */}
                        <span>Órdenes</span>
                    </Link>
                    <Link to="/dashboard/schedule"
                          className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
                        <FaCalendarAlt className="text-xl"/> {/* Ícono de calendario */}
                        <span>Programación</span>
                    </Link>
                    <Link to="/dashboard/report" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
                        <FaFileAlt className="text-xl"/> {/* Ícono de auditoría */}
                        <span>Reportes</span>
                    </Link>
                    <Link to="/dashboard/notification" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
                        <FaBell className="text-xl"/> {/* Ícono de notificaciones */}
                        <span>Notificaciones</span>
                    </Link>
                    <Link to="/dashboard/medicalSample" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
                        <FaFilePen className="text-xl"/> {/* Ícono de notificaciones */}
                        <span>Formulario Muestras Medicas</span>
                    </Link>
                </nav>
            </div>
        </aside>
    );
};

export default DashboardPageSidebar;

