import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

const LoginPageHeader = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Logo />
                <nav>
                    <ul className="flex space-x-4">
                        <li><Link to="/" className="text-gray-600 hover:text-primary">Inicio</Link></li>
                        <li><Link to="/products" className="text-gray-600 hover:text-primary">Productos</Link></li>
                        <li><Link to="/contact" className="text-gray-600 hover:text-primary">Contacto</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default LoginPageHeader;
