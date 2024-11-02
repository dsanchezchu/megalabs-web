import React from 'react';
import { Link } from 'react-router-dom';

const HomePageSidebar = () => {
    const token = localStorage.getItem('token');

    if (!token) return null;  // No mostrar el sidebar si el usuario no está autenticado

    return (
        <aside className="w-1/5 bg-gray-800 text-white h-screen p-4">
            <nav className="space-y-4">
                <Link to="/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">Dashboard</Link>
                <Link to="/orders" className="block py-2 px-4 hover:bg-gray-700 rounded">Orders</Link>
                <Link to="/schedule" className="block py-2 px-4 hover:bg-gray-700 rounded">Schedule</Link>
            </nav>
        </aside>
    );
};

export default HomePageSidebar;

