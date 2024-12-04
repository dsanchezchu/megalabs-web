// src/config/apiConfig.js
//export const API_BASE_URL = 'https://megalabs-api.onrender.com/api/v1';

export const API_BASE_URL = 'http://localhost:8080/api/v1';


// URL del frontend según el entorno
export const FRONTEND_URL = process.env.NODE_ENV === 'production' 
  ? 'https://megalabs-web.netlify.app/'  // Reemplaza con tu dominio real en Netlify
  : 'http://localhost:3000';