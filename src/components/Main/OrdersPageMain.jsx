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

    const productoData = [
        { id_producto: 1, fecha_venta: "2024-01-01", nombre: "Paracetamol", stock: "EN_STOCK", cantidad: 50, precio: 2.5 },
        { id_producto: 2, fecha_venta: "2024-01-02", nombre: "Ibuprofeno", stock: "AGOTADO", cantidad: 30, precio: 3.2 },
        { id_producto: 3, fecha_venta: "2024-01-03", nombre: "Alcohol en Gel", stock: "EN_STOCK", cantidad: 20, precio: 15.0 },
        { id_producto: 4, fecha_venta: "2024-01-04", nombre: "Guantes Quirúrgicos", stock: "EN_STOCK", cantidad: 10, precio: 8.0 },
        { id_producto: 5, fecha_venta: "2024-01-05", nombre: "Termómetro Digital", stock: "AGOTADO", cantidad: 5, precio: 75.0 },
        { id_producto: 6, fecha_venta: "2024-01-06", nombre: "Jeringas Desechables", stock: "EN_STOCK", cantidad: 100, precio: 0.9 },
        { id_producto: 7, fecha_venta: "2024-01-07", nombre: "Oxímetro de Pulso", stock: "EN_STOCK", cantidad: 3, precio: 120.0 }
    ];

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedData = React.useMemo(() => {
        if (!sortConfig.key) return productoData;

        return [...productoData].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    }, [productoData, sortConfig]);

    const filteredData = React.useMemo(() => {
        return sortedData.filter(item => {
            if (!dateFilter.start || !dateFilter.end) return true;
            const itemDate = new Date(item.fecha_venta);
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

    const ventasPorEstadoStock = React.useMemo(() => {
        const estados = { EN_STOCK: 0, AGOTADO: 0 };
        productoData.forEach(item => {
            estados[item.stock] += item.cantidad * item.precio;
        });
        return estados;
    }, [productoData]);

    const barChartData = {
        labels: Object.keys(ventasPorEstadoStock),
        datasets: [
            {
                label: "Ventas por Estado de Stock",
                data: Object.values(ventasPorEstadoStock),
                backgroundColor: ["rgba(24, 163, 84, 0.5)", "rgba(255, 99, 132, 0.5)"],
                borderColor: ["rgb(24, 163, 84)", "rgb(255, 99, 132)"],
                borderWidth: 1
            }
        ]
    };

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-theme-color-neutral">Reporte de Ventas por Producto</h1>

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
                            <th className="p-4 cursor-pointer" onClick={() => handleSort("nombre")}>
                                <div className="flex items-center gap-2">
                                    Producto
                                    {sortConfig.key === "nombre" && (
                                        sortConfig.direction === "asc" ? <BsArrowUp /> : <BsArrowDown />
                                    )}
                                </div>
                            </th>
                            <th className="p-4">Estado</th>
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
                                    Precio (S/)
                                    {sortConfig.key === "precio" && (
                                        sortConfig.direction === "asc" ? <BsArrowUp /> : <BsArrowDown />
                                    )}
                                </div>
                            </th>
                            <th className="p-4">Fecha Venta</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedData.map((producto) => (
                            <tr key={producto.id_producto} className="border-b hover:bg-gray-50">
                                <td className="p-4">{producto.nombre}</td>
                                <td className="p-4">{producto.stock}</td>
                                <td className="p-4">{producto.cantidad}</td>
                                <td className="p-4">S/{producto.precio.toFixed(2)}</td>
                                <td className="p-4">{new Date(producto.fecha_venta).toLocaleDateString()}</td>
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

            <div className="mt-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Ventas por Estado de Stock</h2>
                    <Bar data={barChartData} />
                </div>
            </div>
        </div>
    );
};

export default OrdersPageMain;