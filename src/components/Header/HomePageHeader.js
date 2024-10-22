import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HomePageHeader = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
            <h1 className="text-xl">Megalabs Dashboard</h1>
            {token && (
                <div>
                    <Link to="/dashboard" className="mr-4">Dashboard</Link>
                    <button onClick={handleLogout} className="btn btn-outline">Logout</button>
                </div>
            )}
        </header>
    );
};

export default HomePageHeader;
