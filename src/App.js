// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import HeaderPage from './components/Header/HeaderPage';

function App() {
    return (
        <Router>
            <HeaderPage /> {/* Asegúrate de que HeaderPage esté bajo el Router */}
            <AppRoutes />
        </Router>
    );
}

export default App;


