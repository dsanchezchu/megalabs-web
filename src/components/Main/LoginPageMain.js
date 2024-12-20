import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import { showSuccessAlert, showErrorAlert } from '../../services/AlertService';

const LoginPageMain = () => {
    const [dni, setDni] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Primero verificar si hay una sesión activa
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
            return; // Importante: salir temprano del useEffect
        }

        // Si no hay sesión activa, entonces verificar credenciales guardadas
        const savedDni = localStorage.getItem('rememberedDni');
        const savedPassword = localStorage.getItem('rememberedPassword');

        if (savedDni && savedPassword) {
            setDni(savedDni);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, [navigate]); // Importante: incluir navigate en las dependencias

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Enviar las credenciales al endpoint de inicio de sesión
            const response = await axios.post(
                `${API_BASE_URL}/auth/login`,
                { dni, password },
                { headers: { 'Content-Type': 'application/json' } }
            );

            // Extraer datos de la respuesta
            const { token, nombre, role } = response.data;

            // Guardar el token en localStorage
            localStorage.setItem('token', token);

            // Opcional: Guardar otros detalles en localStorage si los necesitas
            localStorage.setItem('nombre', nombre);
            localStorage.setItem('role', role);
            localStorage.setItem('dni', dni);

            // Guardar credenciales si "Recordarme" está activado
            if (rememberMe) {
                localStorage.setItem('rememberedDni', dni);
                localStorage.setItem('rememberedPassword', password);
            } else {
                localStorage.removeItem('rememberedDni');
                localStorage.removeItem('rememberedPassword');
            }

            await showSuccessAlert('¡Inicio de sesión exitoso!');
            navigate('/dashboard');
        } catch (error) {
            showErrorAlert(
                error.response?.data?.message ||
                'Error al iniciar sesión. Verifica tus credenciales.'
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
            <div className="space-y-6 w-full max-w-md">
                {/* DNI Input */}
                <div className="form-control">
                    <label className="label" htmlFor="dni">
                        <span className="label-text text-gray-600">DNI del Representante</span>
                    </label>
                    <div className="input input-bordered flex items-center gap-2 focus-within:ring-2 focus-within:ring-gray-400 focus-within:border-transparent bg-gray-100 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-5 w-5 opacity-60 ml-2 text-gray-500">
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"/>
                        </svg>
                        <input
                            type="text"
                            id="dni"
                            placeholder="Ingrese su DNI"
                            className="grow bg-gray-100 text-gray-800 focus:outline-none rounded-md"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Contraseña Input */}
                <div className="form-control">
                    <label className="label" htmlFor="password">
                        <span className="label-text text-gray-600">Contraseña</span>
                    </label>
                    <div className="input input-bordered flex items-center gap-2 focus-within:ring-2 focus-within:ring-gray-400 focus-within:border-transparent bg-gray-100 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-5 w-5 opacity-60 ml-2 text-gray-500">
                            <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd"/>
                        </svg>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            className="grow bg-gray-100 text-gray-800 focus:outline-none rounded-md"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Mensaje de Error */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="label-text ml-2 text-gray-700">Recordarme</span>
                </label>
                <Link to="/passwordrecovery" className="text-sm text-primary hover:text-primary-focus hover:underline">
                    ¿Olvidaste tu contraseña?
                </Link>
            </div>

            <button
                type="submit"
                className="btn btn-primary w-full hover:bg-primary-focus transition duration-200 ease-in-out"
            >
                Iniciar sesión
            </button>
        </form>
    );
};

export default LoginPageMain;
