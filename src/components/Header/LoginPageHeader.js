import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

const LoginPageHeader = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Logo */}
                <div className="flex items-center">
                    <Logo className="h-10 w-auto mr-4" />
                </div>

                {/* Menú de Navegación */}
                <nav className="flex-grow flex justify-end items-center space-x-8">
                    <Link to="/" className="text-gray-700 hover:text-primary hover:underline">
                        Inicio
                    </Link>
                    <Link to="/security" className="text-gray-700 hover:text-primary hover:underline">
                        Seguridad y respaldo
                    </Link>
                    <Link to="/certifications" className="text-gray-700 hover:text-primary hover:underline">
                        Certificaciones y Buenas Prácticas
                    </Link>
                    <Link to="/contact" className="text-gray-700 hover:text-primary hover:underline">
                        Contacto
                    </Link>

                </nav>
            </div>
        </header>
    );
};

export default LoginPageHeader;

