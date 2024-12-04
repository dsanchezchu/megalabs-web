import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import { showSuccessAlert, showErrorAlert } from '../../services/AlertService';

const ReportsPageMain = () => {
    const [impact, setImpact] = useState('');
    const [nonConformities, setNonConformities] = useState('');
    const [recommendations, setRecommendations] = useState('');
    const [regulationDeviations, setRegulationDeviations] = useState('');
    const [correctiveActions, setCorrectiveActions] = useState('');
    const [reportStatus, setReportStatus] = useState('PENDIENTE'); // Estado del reporte
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const reportData = {
            impacto: impact.toUpperCase(),
            inconformidades: nonConformities,
            recomendaciones: recommendations,
            desviaciones: regulationDeviations,
            accionesCorrectivas: correctiveActions,
            estadoReporte: reportStatus,
            fechaCreacion: new Date().toISOString(),
            enviado: false,
        };

        try {
            await axios.post(
                `${API_BASE_URL}/reportes/compliance/crear`,
                reportData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            );
            await showSuccessAlert('Reporte enviado correctamente');
            resetForm();
        } catch (error) {
            showErrorAlert(
                error.response?.data?.message || 
                'Error al enviar el reporte. Inténtalo nuevamente.'
            );
        }
    };

    const resetForm = () => {
        setImpact('');
        setNonConformities('');
        setRecommendations('');
        setRegulationDeviations('');
        setCorrectiveActions('');
        setReportStatus('PENDIENTE');
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-base-200 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4 text-center">Reporte de Cumplimiento Regulatorio</h1>
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
                        <option value="" disabled>Seleccionar impacto</option>
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

                {/* Desviaciones de Regulaciones */}
                <div>
                    <label htmlFor="regulationDeviations" className="block text-lg font-semibold">
                        Desviaciones de Regulaciones
                    </label>
                    <textarea
                        id="regulationDeviations"
                        className="textarea textarea-bordered w-full mt-2"
                        placeholder="Describe las desviaciones encontradas"
                        value={regulationDeviations}
                        onChange={(e) => setRegulationDeviations(e.target.value)}
                        required
                    ></textarea>
                </div>

                {/* Acciones Correctivas */}
                <div>
                    <label htmlFor="correctiveActions" className="block text-lg font-semibold">
                        Acciones Correctivas
                    </label>
                    <textarea
                        id="correctiveActions"
                        className="textarea textarea-bordered w-full mt-2"
                        placeholder="Acciones necesarias para corregir problemas"
                        value={correctiveActions}
                        onChange={(e) => setCorrectiveActions(e.target.value)}
                        required
                    ></textarea>
                </div>

                {/* Estado del Reporte */}
                <div>
                    <label htmlFor="reportStatus" className="block text-lg font-semibold">
                        Estado del Reporte
                    </label>
                    <select
                        id="reportStatus"
                        className="select select-bordered w-full mt-2"
                        value={reportStatus}
                        onChange={(e) => setReportStatus(e.target.value)}
                        required
                    >
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="APROBADO">Aprobado</option>
                        <option value="NO_APROBADO">No Aprobado</option>
                    </select>
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

export default ReportsPageMain;