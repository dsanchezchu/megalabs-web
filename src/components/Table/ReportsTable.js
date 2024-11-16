// src/components/Table/ReportsTable.js
import React from 'react';

const ReportsTable = ({ reports, type }) => {
    return (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
            <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b font-semibold text-gray-700">ID</th>
                <th className="py-2 px-4 border-b font-semibold text-gray-700">Fecha de Creación</th>
                {type === 'auditoria' ? (
                    <>
                        <th className="py-2 px-4 border-b font-semibold text-gray-700">Impacto</th>
                        <th className="py-2 px-4 border-b font-semibold text-gray-700">Inconformidades</th>
                        <th className="py-2 px-4 border-b font-semibold text-gray-700">Recomendaciones</th>
                    </>
                ) : (
                    <>
                        <th className="py-2 px-4 border-b font-semibold text-gray-700">Contenido Auditoría</th>
                        <th className="py-2 px-4 border-b font-semibold text-gray-700">Acciones Correctivas</th>
                        <th className="py-2 px-4 border-b font-semibold text-gray-700">Producto</th>
                    </>
                )}
                <th className="py-2 px-4 border-b font-semibold text-gray-700">Estado</th>
                <th className="py-2 px-4 border-b font-semibold text-gray-700">Enviado</th>
            </tr>
            </thead>
            <tbody>
            {reports.length > 0 ? (
                reports.map((report) => (
                    <tr key={report.id} className="text-gray-700">
                        <td className="py-2 px-4 border-b text-center">{report.id}</td>
                        <td className="py-2 px-4 border-b text-center">{new Date(report.fechaCreacion).toLocaleDateString()}</td>
                        {type === 'auditoria' ? (
                            <>
                                <td className="py-2 px-4 border-b text-center">{report.impacto}</td>
                                <td className="py-2 px-4 border-b text-center">{report.inconformidades}</td>
                                <td className="py-2 px-4 border-b text-center">{report.recomendaciones}</td>
                            </>
                        ) : (
                            <>
                                <td className="py-2 px-4 border-b text-center">{report.contenidoAuditoria}</td>
                                <td className="py-2 px-4 border-b text-center">{report.accionesCorrectivas}</td>
                                <td className="py-2 px-4 border-b text-center">{report.producto ? report.producto.nombre : ''}</td>
                            </>
                        )}
                        <td className="py-2 px-4 border-b text-center">{report.estadoReporte}</td>
                        <td className="py-2 px-4 border-b text-center">{report.enviado ? 'Sí' : 'No'}</td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={type === 'auditoria' ? 7 : 6} className="text-center py-4 text-gray-500">
                        No hay reportes disponibles.
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    );
};

export default ReportsTable;
