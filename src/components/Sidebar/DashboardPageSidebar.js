import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaClipboardList, FaFileAlt, FaHome, FaBell } from "react-icons/fa";
import { FaFilePen } from "react-icons/fa6";
import {MdOutlineMail, MdScience} from "react-icons/md";
import { FaBars } from "react-icons/fa";
import { GiMedicines } from "react-icons/gi";
import { RiPagesLine } from "react-icons/ri";

const DashboardPageSidebar = () => {
    const token = localStorage.getItem('token');
    const [isCollapsed, setIsCollapsed] = useState(false); // Estado para manejar el sidebar colapsado o expandido

    if (!token) return null; // No mostrar el sidebar si el usuario no está autenticado

    return (
        <aside className={`bg-gray-800 text-white h-auto ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
            {/* Botón para colapsar/expandir */}
            <div className="flex justify-end p-4">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-white focus:outline-none hover:bg-gray-700 p-2 rounded"
                >
                    <FaBars />
                </button>
            </div>

            <div className="flex flex-col items-start h-full">
                {/* Logo o título del dashboard */}
                {!isCollapsed && (
                    <div className="p-4 text-2xl font-bold border-b border-gray-700 w-full text-center">
                        Dashboard
                    </div>
                )}

                {/* Navegación */}
                <nav className="flex-grow w-full p-2">
                    {/* Cada enlace está centrado */}
                    <Link to="/dashboard" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : ''}`}>
                        <FaHome className="text-xl" />
                        {!isCollapsed && <span className="ml-3">Inicio</span>}
                    </Link>

                    <Link to="/dashboard/orders" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : ''}`}>
                        <FaClipboardList className="text-xl" />
                        {!isCollapsed && <span className="ml-3">Órdenes</span>}
                    </Link>

                    <Link to="/dashboard/schedule" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : ''}`}>
                        <FaCalendarAlt className="text-xl" />
                        {!isCollapsed && <span className="ml-3">Programación</span>}
                    </Link>

                    <Link to="/dashboard/report" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : ''}`}>
                        <FaFileAlt className="text-xl" />
                        {!isCollapsed && <span className="ml-3">Reportes</span>}
                    </Link>

                    <Link to="/dashboard/notification" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : ''}`}>
                        <FaBell className="text-xl" />
                        {!isCollapsed && <span className="ml-3">Notificaciones</span>}
                    </Link>

                    <Link to="/dashboard/medicalSample" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : ''}`}>
                        <FaFilePen className="text-xl" />
                        {!isCollapsed && <span className="ml-3">Formulario Muestras Médicas</span>}
                    </Link>

                    <Link to="/dashboard/notifications" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : ''}`}>
                        <MdOutlineMail className="text-xl" />
                        {!isCollapsed && <span className="ml-3">Notificar Representantes</span>}
                    </Link>

                    <Link to="/dashboard/medicamentos" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : ''}`}>
                        <GiMedicines className="text-xl" />
                        {!isCollapsed && <span className="ml-3">Medicamentos</span>}
                    </Link>

                    <Link to="/dashboard/encuestasentrega" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : ''}`}>
                        <RiPagesLine className="text-xl" />
                        {!isCollapsed && <span className="ml-3">Encuesta Entrega</span>}
                    </Link>
                    <Link to="/dashboard/estudiosclinicos" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : ''}`}>
                        <MdScience className="text-xl" />
                        {!isCollapsed && <span className="ml-3">Estudios Clínicos</span>}
                    </Link>
                </nav>
            </div>
        </aside>
    );
};

export default DashboardPageSidebar;
