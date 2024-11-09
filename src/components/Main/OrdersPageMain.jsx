import React, { useState } from "react";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const OrdersPageMain = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
    const itemsPerPage = 5;

    const ventasData = [
        { id: 1, producto: "Laptop HP", cantidad: 5, precio: 999.99, fecha: "2024-01-15", categoria: "Electrónicos" },
        { id: 2, producto: "Monitor Dell", cantidad: 8, precio: 299.99, fecha: "2024-01-16", categoria: "Electrónicos" },
        { id: 3, producto: "Teclado Mecánico", cantidad: 12, precio: 89.99, fecha: "2024-01-17", categoria: "Accesorios" },
        { id: 4, producto: "Mouse Inalámbrico", cantidad: 15, precio: 45.99, fecha: "2024-01-18", categoria: "Accesorios" },
        { id: 5, producto: "Impresora Canon", cantidad: 3, precio: 199.99, fecha: "2024-01-19", categoria: "Electrónicos" },
        { id: 6, producto: "Webcam HD", cantidad: 10, precio: 79.99, fecha: "2024-01-20", categoria: "Accesorios" },
        { id: 7, producto: "Disco Duro SSD", cantidad: 20, precio: 129.99, fecha: "2024-01-21", categoria: "Componentes" }
    ];

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedData = React.useMemo(() => {
        if (!sortConfig.key) return ventasData;

        return [...ventasData].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    }, [ventasData, sortConfig]);

    const filteredData = React.useMemo(() => {
        return sortedData.filter(item => {
            if (!dateFilter.start || !dateFilter.end) return true;
            const itemDate = new Date(item.fecha);
            const startDate = new Date(dateFilter.start);
            const endDate = new Date(dateFilter.end);
            return itemDate >= startDate && itemDate <= endDate;
        });
    }, [sortedData, dateFilter]);

    const paginatedData = React.useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const ventasPorCategoria = React.useMemo(() => {
        const categorias = {};
        ventasData.forEach(item => {
            if (!categorias[item.categoria]) {
                categorias[item.categoria] = 0;
            }
            categorias[item.categoria] += item.cantidad * item.precio;
        });
        return categorias;
    }, [ventasData]);

    const ventasPorFecha = React.useMemo(() => {
        const fechas = {};
        ventasData.forEach(item => {
            if (!fechas[item.fecha]) {
                fechas[item.fecha] = 0;
            }
            fechas[item.fecha] += item.cantidad * item.precio;
        });
        return fechas;
    }, [ventasData]);

    const barChartData = {
        labels: Object.keys(ventasPorCategoria),
        datasets: [
            {
                label: "Ventas por Categoría",
                data: Object.values(ventasPorCategoria),
                backgroundColor: "rgba(24, 163, 84, 0.5)",
                borderColor: "rgb(24, 163, 84)",
                borderWidth: 1
            }
        ]
    };

    const lineChartData = {
        labels: Object.keys(ventasPorFecha),
        datasets: [
            {
                label: "Tendencia de Ventas",
                data: Object.values(ventasPorFecha),
                fill: false,
                borderColor: "rgb(24, 163, 84)",
                tension: 0.1
            }
        ]
    };

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-theme-color-neutral">Reporte de Ventas</h1>

            <div className="mb-6">
                <div className="flex gap-4 mb-4">
                    <div className="flex flex-col">
                        <label className="text-sm text-theme-color-neutral mb-1">Fecha Inicio:</label>
                        <input
                            type="date"
                            className="border rounded-md p-2"
                            value={dateFilter.start}
                            onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm text-theme-color-neutral mb-1">Fecha Fin:</label>
                        <input
                            type="date"
                            className="border rounded-md p-2"
                            value={dateFilter.end}
                            onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-theme-color-primary text-white">
                            <th className="p-4 cursor-pointer" onClick={() => handleSort("producto")}>
                                <div className="flex items-center gap-2">
                                    Producto
                                    {sortConfig.key === "producto" && (
                                        sortConfig.direction === "asc" ? <BsArrowUp /> : <BsArrowDown />
                                    )}
                                </div>
                            </th>
                            <th className="p-4 cursor-pointer" onClick={() => handleSort("cantidad")}>
                                <div className="flex items-center gap-2">
                                    Cantidad
                                    {sortConfig.key === "cantidad" && (
                                        sortConfig.direction === "asc" ? <BsArrowUp /> : <BsArrowDown />
                                    )}
                                </div>
                            </th>
                            <th className="p-4 cursor-pointer" onClick={() => handleSort("precio")}>
                                <div className="flex items-center gap-2">
                                    Precio
                                    {sortConfig.key === "precio" && (
                                        sortConfig.direction === "asc" ? <BsArrowUp /> : <BsArrowDown />
                                    )}
                                </div>
                            </th>
                            <th className="p-4 cursor-pointer" onClick={() => handleSort("fecha")}>
                                <div className="flex items-center gap-2">
                                    Fecha
                                    {sortConfig.key === "fecha" && (
                                        sortConfig.direction === "asc" ? <BsArrowUp /> : <BsArrowDown />
                                    )}
                                </div>
                            </th>
                            <th className="p-4">Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedData.map((venta) => (
                            <tr key={venta.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{venta.producto}</td>
                                <td className="p-4">{venta.cantidad}</td>
                                <td className="p-4">${venta.precio.toFixed(2)}</td>
                                <td className="p-4">{new Date(venta.fecha).toLocaleDateString()}</td>
                                <td className="p-4">${(venta.cantidad * venta.precio).toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded ${currentPage === page ? 'bg-theme-color-primary text-white' : 'bg-gray-200'}`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Ventas por Categoría</h2>
                    <Bar data={barChartData} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Tendencia de Ventas</h2>
                    <Line data={lineChartData} />
                </div>
            </div>
        </div>
    );
};

export default OrdersPageMain;