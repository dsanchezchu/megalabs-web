import React from 'react';
import { Link } from 'react-router-dom';


const HomePageMain = ({ children }) => {
    return (
        <main className="flex flex-col items-center w-full bg-white">
            {/* Sección de imagen principal con texto sobrepuesto */}
            <div className="relative w-full h-[400px]">
                <img
                    src="ruta/de/la/imagen.jpg" // Reemplaza con la ruta real de la imagen
                    alt="Familia usando dispositivo"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-center items-start bg-opacity-70 bg-white p-10 w-full">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Hacer la diferencia</h2>
                    <p className="text-lg text-gray-700">
                        Aspiramos a mejorar la calidad de vida de las personas que nos eligen día a día.
                    </p>
                </div>
            </div>

            {/* Sección de video e información adicional */}
            <div className="w-full px-6 py-10 flex flex-col md:flex-row gap-8 bg-white">
                <div className="md:w-1/2 w-full">
                    <iframe
                        width="100%"
                        height="500"
                        src="https://www.youtube.com/embed/r9ZzKlW3VYg" // Reemplaza con el ID del video correcto
                        title="Megalabs institucional - Orientados al futuro"
                        className="rounded-lg shadow-md w-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                <div className="md:w-1/2 w-full">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Visión global</h3>
                    <p className="text-gray-700">
                    Somos una empresa de origen Latinoamericano con presencia en 18 países. Conocemos las necesidades de nuestra gente y somos parte activa de las comunidades a las que servimos. Por eso trabajamos con rigor científico y tecnología de vanguardia para hacer soluciones terapéuticas accesibles y de calidad global.
                    </p>
                </div>
            </div>

            {/* Sección de Servicios usando DaisyUI */}
            <div className="w-full px-6 py-10 bg-gray-50">
                <h3 className="text-3xl font-bold text-center mb-8 text-gray-900">Nuestros Servicios</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="card bg-white shadow-lg p-4">
                        <h4 className="card-title text-xl font-bold mb-2 text-gray-900">Análisis Clínicos</h4>
                        <p className="text-gray-700">Ofrecemos una amplia variedad de análisis clínicos para el diagnóstico y control de enfermedades.</p>
                    </div>
                    <div className="card bg-white shadow-lg p-4">
                        <h4 className="card-title text-xl font-bold mb-2 text-gray-900">Pruebas de ADN</h4>
                        <p className="text-gray-700">Realizamos pruebas de ADN para estudios genéticos y análisis de parentesco.</p>
                    </div>
                    <div className="card bg-white shadow-lg p-4">
                        <h4 className="card-title text-xl font-bold mb-2 text-gray-900">Exámenes Preventivos</h4>
                        <p className="text-gray-700">Programas de chequeo preventivo para mantener una salud óptima y detectar riesgos tempranos.</p>
                    </div>
                    <div className="card bg-white shadow-lg p-4">
                        <h4 className="card-title text-xl font-bold mb-2 text-gray-900">Pruebas Covid-19</h4>
                        <p className="text-gray-700">Ofrecemos pruebas rápidas y PCR para la detección del COVID-19.</p>
                    </div>
                </div>
            </div>

            {/* Sección de Ventajas */}
            <div className="w-full px-6 py-10 bg-gray-100">
                <h3 className="text-3xl font-bold text-center mb-8 text-gray-900">¿Por qué elegirnos?</h3>
                <div className="flex flex-wrap justify-around gap-6">
                    <div className="flex items-start gap-4">
                        <span className="text-green-500 text-4xl">✓</span>
                        <p className="text-gray-700">Resultados rápidos y precisos</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <span className="text-green-500 text-4xl">✓</span>
                        <p className="text-gray-700">Laboratorio certificado y equipos de última tecnología</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <span className="text-green-500 text-4xl">✓</span>
                        <p className="text-gray-700">Personal altamente calificado</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <span className="text-green-500 text-4xl">✓</span>
                        <p className="text-gray-700">Facilidad de agendamiento en línea</p>
                    </div>
                </div>
            </div>

            {/* Llamada a la acción */}
            <div className="w-full px-6 py-10 bg-gray-200 text-gray-900 text-center">
                <h3 className="text-3xl font-bold mb-4">Agenda tu cita hoy mismo</h3>
                <p className="mb-6">Accede a nuestros servicios y obtén resultados rápidos y confiables.</p>
                <Link to="/login">
                    <button className="btn btn-primary text-white font-bold rounded-full">
                        Agendar Cita
                    </button>
                </Link>
            </div>

            {/* Contenido adicional (hijos) */}
            <div className="w-full px-6 py-10 bg-white">
                {children}
            </div>
        </main>
    );
};

export default HomePageMain;
