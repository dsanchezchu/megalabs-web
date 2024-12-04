import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaClipboardList, FaFileAlt, FaHome, FaBell } from "react-icons/fa";
import { FaFilePen } from "react-icons/fa6";
import { MdOutlineMail, MdScience } from "react-icons/md";
import { FaBars } from "react-icons/fa";
import { GiMedicines } from "react-icons/gi";
import { RiPagesLine } from "react-icons/ri";
import { FaPersonShelter } from "react-icons/fa6";

const DashboardPageSidebar = () => {
    const token = localStorage.getItem('token');
    const [isCollapsed, setIsCollapsed] = useState(false); // Estado para manejar el sidebar colapsado o expandido

    if (!token) return null; // No mostrar el sidebar si el usuario no está autenticado

    return (
        <aside className={`bg-gray-800 text-white h-screen ${isCollapsed ? 'w-12' : 'w-48'} transition-all duration-300 shadow-lg`}>
            {/* Botón para colapsar/expandir */}
            <div className="flex justify-center items-center p-4">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-white focus:outline-none hover:bg-gray-700 p-2 rounded flex justify-center items-center"
                    style={{ width: '2.5rem', height: '2.5rem' }} // Tamaño consistente
                >
                    <FaBars className="text-xl" />
                </button>
            </div>

            <div className="flex flex-col items-center h-full">
                {/* Navegación */}
                <nav className="flex-grow w-full p-2">
                    {/* Cada enlace está centrado */}
                    <Link to="/dashboard" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                        <FaHome className="text-xl" />
                        {!isCollapsed && <span className="ml-3 text-sm">Inicio</span>}
                    </Link>

                    <Link to="/dashboard/orders" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                        <FaClipboardList className="text-xl" />
                        {!isCollapsed && <span className="ml-3 text-sm">Órdenes</span>}
                    </Link>

                    <Link to="/dashboard/schedule" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                        <FaCalendarAlt className="text-xl" />
                        {!isCollapsed && <span className="ml-3 text-sm">Programación</span>}
                    </Link>

                    <Link to="/dashboard/report" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                        <FaFileAlt className="text-xl" />
                        {!isCollapsed && <span className="ml-3 text-sm">Reportes</span>}
                    </Link>

                    <Link to="/dashboard/notification" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                        <FaBell className="text-xl" />
                        {!isCollapsed && <span className="ml-3 text-sm">Notificaciones</span>}
                    </Link>

                    <Link to="/dashboard/medicalSample" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                        <FaFilePen className="text-xl" />
                        {!isCollapsed && <span className="ml-3 text-sm">Formulario Muestras Médicas</span>}
                    </Link>

                    <Link to="/dashboard/notifications" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                        <MdOutlineMail className="text-xl" />
                        {!isCollapsed && <span className="ml-3 text-sm">Notificar Representantes</span>}
                    </Link>

                    <Link to="/dashboard/medicamentos" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                        <GiMedicines className="text-xl" />
                        {!isCollapsed && <span className="ml-3 text-sm">Medicamentos</span>}
                    </Link>

                    <Link to="/dashboard/encuestasentrega" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                        <RiPagesLine className="text-xl" />
                        {!isCollapsed && <span className="ml-3 text-sm">Encuesta Entrega</span>}
                    </Link>

                    <Link to="/dashboard/estudiosclinicos" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                        <MdScience className="text-xl" />
                        {!isCollapsed && <span className="ml-3 text-sm">Estudios Clínicos</span>}
                    </Link>

                    <Link to="/dashboard/encuestasrecojo" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                        <RiPagesLine className="text-xl" />
                        {!isCollapsed && <span className="ml-3 text-sm">Encuestas Recojo</span>}
                    </Link>

                    <Link to="/dashboard/historialvisitas" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                        <FaPersonShelter className="text-xl" />
                        {!isCollapsed && <span className="ml-3 text-sm">Historial de Visitas</span>}
                    </Link>
                </nav>
            </div>
        </aside>
    );
};

export default DashboardPageSidebar;