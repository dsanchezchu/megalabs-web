import React, { useState, useEffect, useCallback } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FiSearch, FiCalendar, FiClock, FiUser } from "react-icons/fi";
import esES from "date-fns/locale/es";
import { obtenerCitasPorRepresentante } from "../../services/CalendarService";
import  "./DashboardPageMain.css";

const locales = {
    es: esES,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const AppointmentCard = ({ appointment, onComplete }) => (
    <div
        className={`bg-gradient-to-r ${
            appointment.motivo.includes("Chequeo")
                ? "from-green-100 to-green-50"
                : "from-lime-100 to-lime-50"
        } p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200`}
        aria-label={`Cita con ${appointment.nombreCliente}`}
    >
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-semibold text-lg text-gray-700">
                    {appointment.nombreCliente}
                </h3>
                <p className="text-sm text-gray-600">{appointment.motivo}</p>
            </div>
            <div className="text-right">
                <p className="text-sm text-green-700 font-semibold">
                    <FiClock className="inline-block mr-1" />
                    {format(new Date(appointment.fechaHora), "h:mm a", { locale: esES })}
                </p>
                <p className="text-sm text-gray-500">
                    {format(new Date(appointment.fechaHora), "d MMM yyyy", { locale: esES })}
                </p>
            </div>
        </div>
    </div>
);

const CalendarEvent = ({ event }) => (
    <div className="p-1">
        <strong className="block text-sm text-gray-800">{event.nombreCliente}</strong>
        <span className="text-xs text-gray-600">{event.motivo}</span>
        <span className="text-xs block text-gray-500">
      {format(new Date(event.fechaHora), "h:mm a", { locale: esES })}
    </span>
    </div>
);

const DashboardPageMain = () => {
    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [view, setView] = useState("month");
    const [sortBy, setSortBy] = useState("date");
    const [dniRepresentante, setDniRepresentante] = useState("");

    useEffect(() => {
        const dni = localStorage.getItem("dni") || "12345678";
        setDniRepresentante(dni);

        const fetchAppointments = async () => {
            try {
                const fetchedAppointments = await obtenerCitasPorRepresentante(dni);
                setAppointments(fetchedAppointments);
            } catch (error) {
                console.error("Error al cargar las citas:", error);
            }
        };

        fetchAppointments();
    }, []);

    const handleSearch = useCallback(
        (e) => {
            const term = e.target.value.toLowerCase();
            setSearchTerm(term);
            const filtered = appointments.filter(
                (apt) =>
                    apt.nombreCliente.toLowerCase().includes(term) ||
                    apt.motivo.toLowerCase().includes(term)
            );
            setAppointments(filtered);
        },
        [appointments]
    );

    const handleSort = useCallback(
        (type) => {
            setSortBy(type);
            const sorted = [...appointments].sort((a, b) => {
                if (type === "date") {
                    return new Date(a.fechaHora) - new Date(b.fechaHora);
                } else {
                    return a.nombreCliente.localeCompare(b.nombreCliente);
                }
            });
            setAppointments(sorted);
        },
        [appointments]
    );

    const handleComplete = useCallback(
        (id) => {
            setAppointments(appointments.filter((apt) => apt.id !== id));
        },
        [appointments]
    );

    const messages = {
        month: "Mes",
        week: "Semana",
        day: "Día",
        agenda: "Agenda",
        date: "Fecha",
        time: "Hora",
        event: "Evento",
        allDay: "Todo el día",
        previous: "Anterior",
        next: "Siguiente",
        today: "Hoy",
        noEventsInRange: "No hay eventos en este rango",
        showMore: (total) => `+ Ver más (${total})`,
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <header className="bg-gradient-to-r from-green-600 to-green-500 rounded-lg p-6 mb-6 shadow-lg">
                <h1 className="text-3xl font-bold text-white mb-4">Citas Pendientes</h1>
                <nav className="flex space-x-4">
                    {["month", "week", "day"].map((viewOption) => (
                        <button
                            key={viewOption}
                            className={`px-4 py-2 rounded-md ${
                                view === viewOption
                                    ? "bg-green-200 text-green-800"
                                    : "bg-white text-green-600"
                            } hover:bg-green-300 transition-colors duration-200`}
                            onClick={() => setView(viewOption)}
                        >
                            Vista de {viewOption}
                        </button>
                    ))}
                </nav>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <div className="relative flex-1 mr-4">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar citas..."
                                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="flex space-x-2">
                            {[{ type: "date", label: "Fecha" }, { type: "name", label: "Nombre" }].map(
                                ({ type, label }) => (
                                    <button
                                        key={type}
                                        onClick={() => handleSort(type)}
                                        className={`px-4 py-2 rounded-md ${
                                            sortBy === type
                                                ? "bg-green-600 text-white"
                                                : "bg-gray-100 text-gray-800"
                                        } hover:bg-green-700 hover:text-white`}
                                    >
                                        {type === "date" ? (
                                            <FiCalendar className="inline-block mr-2" />
                                        ) : (
                                            <FiUser className="inline-block mr-2" />
                                        )}
                                        {label}
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {appointments.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                onComplete={handleComplete}
                            />
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-lg">
                    <Calendar
                        localizer={localizer}
                        events={appointments.map((apt) => ({
                            ...apt,
                            start: new Date(apt.fechaHora),
                            end: new Date(apt.fechaHora),
                        }))}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 600 }}
                        view={view}
                        onView={(newView) => setView(newView)}
                        components={{
                            event: CalendarEvent,
                        }}
                        messages={messages}
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardPageMain;
