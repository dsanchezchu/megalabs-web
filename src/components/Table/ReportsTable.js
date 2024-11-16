import React from 'react';

const ReportsTable = ({ reports = [], type }) => {
    const formatFechaCreacion = (fecha) => {
        if (!fecha) return "Sin Fecha"; // Manejo de fechas inexistentes o nulas

        const date = new Date(fecha);
        if (isNaN(date)) return "Fecha Inválida"; // Validar que sea una fecha válida

        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatMoneda = (valor) => {
        return `S/ ${valor.toFixed(2)}`; // Formato con soles
    };

    return (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
            <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b font-semibold text-gray-700">ID</th>
                {type !== 'ventas' && (
                    <th className="py-2 px-4 border-b font-semibold text-gray-700">Fecha de Creación</th>
                )}
                {type === 'ventas' && (
                    <>
                        <th className="py-2 px-4 border-b font-semibold text-gray-700">Nombre Producto</th>
                        <th className="py-2 px-4 border-b font-semibold text-gray-700">Estado Stock</th>
                        <th className="py-2 px-4 border-b font-semibold text-gray-700">Total Ventas</th>
                        <th className="py-2 px-4 border-b font-semibold text-gray-700">Precio Promedio</th>
                    </>
                )}
                {type === 'auditoria' && (
                    <>
                        <th className="py-2 px-4 border-b font-semibold text-gray-700">Impacto</th>
                        <th className="py-2 px-4 border-b font-semibold text-gray-700">Inconformidades</th>
                        <th className="py-2 px-4 border-b font-semibold text-gray-700">Recomendaciones</th>
                    </>
                )}
                {type === 'cumplimiento' && (
                    <>
                        <th className="py-2 px-4 border-b font-semibold text-gray-700">Contenido Auditoría</th>
                        <th className="py-2 px-4 border-b font-semibold text-gray-700">Acciones Correctivas</th>
                        <th className="py-2 px-4 border-b font-semibold text-gray-700">Estado</th>
                    </>
                )}
                <th className="py-2 px-4 border-b font-semibold text-gray-700">Enviado</th>
            </tr>
            </thead>
            <tbody>
            {reports.length > 0 ? (
                reports.map((report, index) => (
                    <tr key={report.id || report.idProducto || `report-${index}`} className="text-gray-700">
                        <td className="py-2 px-4 border-b text-center">
                            {type === 'ventas' ? report.idProducto : report.id}
                        </td>
                        {type !== 'ventas' && (
                            <td className="py-2 px-4 border-b text-center">
                                {formatFechaCreacion(report.fechaCreacion)}
                            </td>
                        )}
                        {type === 'ventas' && (
                            <>
                                <td className="py-2 px-4 border-b text-center">{report.nombreProducto}</td>
                                <td className="py-2 px-4 border-b text-center">{report.estadoStock}</td>
                                <td className="py-2 px-4 border-b text-center">{report.totalVentas}</td>
                                <td className="py-2 px-4 border-b text-center">{formatMoneda(report.precioPromedio)}</td>
                            </>
                        )}
                        {type === 'auditoria' && (
                            <>
                                <td className="py-2 px-4 border-b text-center">{report.impacto}</td>
                                <td className="py-2 px-4 border-b text-center">{report.inconformidades}</td>
                                <td className="py-2 px-4 border-b text-center">{report.recomendaciones}</td>
                            </>
                        )}
                        {type === 'cumplimiento' && (
                            <>
                                <td className="py-2 px-4 border-b text-center">{report.contenidoAuditoria}</td>
                                <td className="py-2 px-4 border-b text-center">{report.accionesCorrectivas}</td>
                                <td className="py-2 px-4 border-b text-center">{report.estadoReporte}</td>
                            </>
                        )}
                        <td className="py-2 px-4 border-b text-center">{report.enviado ? 'Sí' : 'No'}</td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td
                        colSpan={type === 'ventas' ? 6 : 7}
                        className="text-center py-4 text-gray-500"
                    >
                        No hay reportes disponibles.
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    );
};

export default ReportsTable;