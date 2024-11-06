// src/components/HeaderPage.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../Logo';
import logout from '../../services/AuthService';

const HeaderPage = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Obtén la ruta actual
    const isAuthenticated = localStorage.getItem('token'); // Verifica si hay un token en localStorage

    const handleLogout = () => {
        logout(navigate); // Llama a la función de logout y redirige al login
    };

    return (
        <header className="bg-white shadow-md">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Logo */}
                <div className="flex items-center">
                    <Logo className="h-10 w-auto mr-4" />
                </div>

                {/* Menú de Navegación */}
                <nav className="flex-grow flex justify-end items-center space-x-8">
                    {isAuthenticated ? (
                        // Cuando el usuario está autenticado (token presente)
                        <>
                            <Link to="/security" className="text-gray-700 hover:text-primary hover:underline">
                                Seguridad y respaldo
                            </Link>
                            <Link to="/certifications" className="text-gray-700 hover:text-primary hover:underline">
                                Certificaciones y Buenas Prácticas
                            </Link>
                            <Link to="/contact" className="text-gray-700 hover:text-primary hover:underline">
                                Contacto
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-gray-700 hover:text-primary hover:underline"
                            >
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        // Cuando el usuario no está autenticado (sin token)
                        <>
                            {location.pathname === '/login' ? ( //Agregar aqui mas links si quieres aqui mas opciones en el loginpage
                                <Link to="/" className="text-gray-700 hover:text-primary hover:underline">
                                    Ir al Inicio
                                </Link>
                            ) : (  //Agregar aqui mas links si quieres aqui mas opciones en el homepage
                                <Link to="/login" className="text-gray-700 hover:text-primary hover:underline">
                                    Iniciar Sesión
                                </Link>
                            )}
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default HeaderPage;