import React from 'react';
import LoginHeader from '../components/Header/LoginPageHeader';
import LoginFooter from '../components/Footer/PageFooter';
import LoginMain from '../components/Main/LoginPageMain';

const LoginPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <LoginHeader />
            <main className="flex-grow flex items-center justify-center bg-gray-100">
                <div className="flex flex-col justify-center items-center w-full max-w-md px-6 py-12">
                    <div className="w-full space-y-8">
                        <div>
                            <h2 className="text-center text-3xl font-extrabold text-gray-900">
                                Iniciar sesión
                            </h2>
                        </div>
                        <LoginMain />
                    </div>
                </div>
            </main>
            <LoginFooter />
        </div>
    );
};

export default LoginPage;
