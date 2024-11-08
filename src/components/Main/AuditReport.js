import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';

const AuditReport = () => {
    const [impact, setImpact] = useState('');
    const [nonConformities, setNonConformities] = useState('');
    const [recommendations, setRecommendations] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const reportData = {
            impacto: impact.toUpperCase(),
            inconformidades: nonConformities,
            recomendaciones: recommendations,
            fechaCreacion: new Date().toISOString(),
            estadoReporte: 'PENDIENTE',
            enviado: false
        };

        try {
            const response = await axios.post(
                `${API_BASE_URL}/reportes/auditoria-interna/crear`,
                reportData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Agrega el token en la cabecera
                    }
                }
            );
            setMessage('Reporte enviado correctamente');
            setError('');

            // Resetear los campos después de enviar
            setImpact('');
            setNonConformities('');
            setRecommendations('');
        } catch (error) {
            setMessage('');
            setError(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : 'Error al enviar el reporte. Inténtalo nuevamente.'
            );
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-base-200 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4 text-center">Reporte de Auditorías Internas</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Clasificación de Impacto */}
                <div>
                    <label htmlFor="impact" className="block text-lg font-semibold">
                        Clasificación de Impacto
                    </label>
                    <select
                        id="impact"
                        className="select select-bordered w-full mt-2"
                        value={impact}
                        onChange={(e) => setImpact(e.target.value)}
                        required
                    >
                        <option value="" disabled>
                            Seleccionar impacto
                        </option>
                        <option value="BAJO">Impacto Bajo</option>
                        <option value="MEDIO">Impacto Medio</option>
                        <option value="ALTO">Impacto Alto</option>
                    </select>
                </div>

                {/* Inconformidades */}
                <div>
                    <label htmlFor="nonConformities" className="block text-lg font-semibold">
                        Inconformidades
                    </label>
                    <textarea
                        id="nonConformities"
                        className="textarea textarea-bordered w-full mt-2"
                        placeholder="Describe las inconformidades encontradas"
                        value={nonConformities}
                        onChange={(e) => setNonConformities(e.target.value)}
                        required
                    ></textarea>
                </div>

                {/* Recomendaciones */}
                <div>
                    <label htmlFor="recommendations" className="block text-lg font-semibold">
                        Recomendaciones
                    </label>
                    <textarea
                        id="recommendations"
                        className="textarea textarea-bordered w-full mt-2"
                        placeholder="Recomendaciones para corregir las inconformidades"
                        value={recommendations}
                        onChange={(e) => setRecommendations(e.target.value)}
                        required
                    ></textarea>
                </div>

                {/* Botón de Enviar */}
                <button type="submit" className="btn btn-primary w-full">
                    Enviar Reporte
                </button>
            </form>

            {/* Mensajes de Confirmación y Error */}
            {message && <p className="mt-4 text-center text-green-500 font-semibold">{message}</p>}
            {error && <p className="mt-4 text-center text-red-500 font-semibold">{error}</p>}
        </div>
    );
};

export default AuditReport;
