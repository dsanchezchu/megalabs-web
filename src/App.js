import React from 'react';
import AppRoutes from './routes/AppRoutes'; // Cambia la ruta según tu estructura de carpetas
import Header from './components/Header/HomePageHeader';
import Sidebar from './components/Sidebar/HomePageSidebar';

function App() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-grow">
                <Header />
                <AppRoutes />  {/* Aquí se incluyen todas las rutas */}
            </div>
        </div>
    );
}

export default App;

