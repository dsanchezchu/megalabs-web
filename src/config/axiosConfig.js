import axios from 'axios';

// Lista de rutas que no requieren token
const publicRoutes = [
  '/api/v1/auth/recover-password',
  '/api/v1/auth/login',
  // Agrega aquí otras rutas públicas
];

// Configurar el interceptor
axios.interceptors.request.use(
    (config) => {
        // Verifica si la URL actual está en la lista de rutas públicas
        const isPublicRoute = publicRoutes.some(route => config.url.includes(route));
        
        // Solo agrega el token si no es una ruta pública
        if (!isPublicRoute) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);