import React from 'react';
import LoginFooter from '../components/Footer/PageFooter';
import LoginMain from '../components/Main/LoginPageMain';

const LoginPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <main
                className="flex-grow flex items-center justify-center bg-gray-100 bg-cover bg-center"
                style={{ backgroundImage: "url('https://megalabsperu.com.pe/wp-content/uploads/2020/02/Cabezal-premio-CFI-IMG_9994-Grupal-lateral-x2.jpg')" }}
            >
                <div className="flex flex-col items-center w-full max-w-md px-6 py-8">
                    {/* Ajuste del fondo a blanco sólido */}
                    <div className="card card-normal w-full shadow-xl p-6 bg-white rounded-lg">
                        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
                            Iniciar sesión
                        </h2>
                        <LoginMain />
                    </div>
                </div>
            </main>
            <LoginFooter />
        </div>
    );
};

export default LoginPage;

