import React, { useState, useEffect } from 'react';
import { FiRefreshCcw } from 'react-icons/fi'; // Importa el icono de recarga de react-icons
import ReportsTable from '../components/Table/ReportsTable';
import { getAuditReports, getComplianceReports } from '../services/ReportService';

const ReportPage = () => {
    const [auditReports, setAuditReports] = useState([]);
    const [complianceReports, setComplianceReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para obtener los datos
    const fetchReports = () => {
        setLoading(true);
        setError(null); // Reinicia el error al intentar recargar
        Promise.all([getAuditReports(), getComplianceReports()])
            .then(([auditResponse, complianceResponse]) => {
                setAuditReports(auditResponse.data);
                setComplianceReports(complianceResponse.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener reportes:", error);
                setError("Error al obtener reportes");
                setLoading(false);
            });
    };

    useEffect(() => {
        // Llamar a fetchReports inmediatamente
        fetchReports();

        // Configurar el intervalo para actualizar cada 5 minutos (300000 ms)
        const intervalId = setInterval(fetchReports, 300000);

        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(intervalId);
    }, []);

    if (loading) return <p>Cargando reportes...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Reportes de Auditoría</h1>
                <button
                    onClick={fetchReports}
                    className="text-blue-600 hover:text-blue-800 focus:outline-none flex items-center"
                    title="Recargar reportes"
                >
                    <FiRefreshCcw className="mr-1" />
                    Recargar
                </button>
            </div>
            <ReportsTable reports={auditReports} type="auditoria" />

            <div className="flex items-center justify-between mt-8 mb-4">
                <h1 className="text-2xl font-bold">Reportes de Cumplimiento</h1>
                <button
                    onClick={fetchReports}
                    className="text-blue-600 hover:text-blue-800 focus:outline-none flex items-center"
                    title="Recargar reportes"
                >
                    <FiRefreshCcw className="mr-1" />
                    Recargar
                </button>
            </div>
            <ReportsTable reports={complianceReports} type="cumplimiento" />
        </div>
    );
};

export default ReportPage;

