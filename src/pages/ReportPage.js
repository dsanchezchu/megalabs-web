import React, { useState, useEffect } from 'react';
import { FiRefreshCcw } from 'react-icons/fi';
import ReportsTable from '../components/Table/ReportsTable';
import { getSalesReports, getAuditReports, getComplianceReports } from '../services/ReportService';

const ReportPage = () => {
    const [salesReports, setSalesReports] = useState([]);
    const [auditReports, setAuditReports] = useState([]);
    const [complianceReports, setComplianceReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReports = () => {
        setLoading(true);
        setError(null);

        Promise.all([getSalesReports(), getAuditReports(), getComplianceReports()])
            .then(([salesResponse, auditResponse, complianceResponse]) => {
                setSalesReports(salesResponse.data);
                setAuditReports(auditResponse.data);
                setComplianceReports(complianceResponse.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error al obtener reportes:', error);
                setError('Error al obtener reportes');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchReports();
        const intervalId = setInterval(fetchReports, 300000); // Actualización automática cada 5 minutos
        return () => clearInterval(intervalId);
    }, []);

    if (loading) return <p>Cargando reportes...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Reportes de Ventas</h1>
                <button
                    onClick={fetchReports}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                    title="Recargar reportes"
                >
                    <FiRefreshCcw className="mr-1" />
                    Recargar
                </button>
            </div>
            <ReportsTable reports={salesReports} type="ventas" />

            <div className="flex items-center justify-between mt-8 mb-4">
                <h1 className="text-2xl font-bold">Reportes de Auditorías Internas</h1>
                <button
                    onClick={fetchReports}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                    title="Recargar reportes"
                >
                    <FiRefreshCcw className="mr-1" />
                    Recargar
                </button>
            </div>
            <ReportsTable reports={auditReports} type="auditoria" />

            <div className="flex items-center justify-between mt-8 mb-4">
                <h1 className="text-2xl font-bold">Reportes de Cumplimiento Regulatorio</h1>
                <button
                    onClick={fetchReports}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
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
