import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import logout from './AuthService';

const INACTIVITY_TIME = 15 * 60 * 1000; // 15 minutos
const WARNING_TIME = 60 * 1000; // 1 minuto antes

export const useInactivityTimeout = () => {
    const navigate = useNavigate();

    const resetTimer = useCallback(() => {
        localStorage.setItem('lastActivity', Date.now().toString());
    }, []);

    const handleLogout = useCallback(async () => {
        await Swal.fire({
            title: 'Sesión cerrada',
            text: 'Su sesión ha sido cerrada por inactividad',
            icon: 'info',
            confirmButtonText: 'Entendido'
        });
        logout(navigate);
    }, [navigate]);

    const showWarning = useCallback(async () => {
        const result = await Swal.fire({
            title: '¡Advertencia de inactividad!',
            html: 'Su sesión se cerrará en 1 minuto por inactividad.<br>¿Desea mantener la sesión activa?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Mantener sesión',
            cancelButtonText: 'Cerrar sesión',
            timer: WARNING_TIME,
            timerProgressBar: true,
        });

        if (result.isConfirmed) {
            resetTimer();
        } else {
            handleLogout();
        }
    }, [navigate, resetTimer, handleLogout]);

    const checkInactivity = useCallback(() => {
        const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0');
        const currentTime = Date.now();
        const timeSinceLastActivity = currentTime - lastActivity;

        if (timeSinceLastActivity >= INACTIVITY_TIME - WARNING_TIME) {
            showWarning();
        } else if (timeSinceLastActivity >= INACTIVITY_TIME) {
            handleLogout();
        }
    }, [showWarning, handleLogout]);

    useEffect(() => {
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        
        // Inicializar el tiempo de última actividad
        resetTimer();

        // Configurar el intervalo de verificación
        const intervalId = setInterval(checkInactivity, 1000);

        // Configurar los event listeners
        const handleActivity = () => {
            resetTimer();
        };

        events.forEach(event => {
            document.addEventListener(event, handleActivity);
        });

        // Limpieza
        return () => {
            clearInterval(intervalId);
            events.forEach(event => {
                document.removeEventListener(event, handleActivity);
            });
        };
    }, [checkInactivity, resetTimer]);
}; 