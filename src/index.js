import React from 'react';
import ReactDOM from 'react-dom/client';  // Importar createRoot desde react-dom/client
import App from './App';
import 'styles/index.css';  // Asumiendo que tienes un archivo de estilos global

// Buscar el elemento root en el DOM
const container = document.getElementById('root');

// Crear una raíz React
const root = ReactDOM.createRoot(container);

// Renderizar la aplicación dentro de la raíz
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
