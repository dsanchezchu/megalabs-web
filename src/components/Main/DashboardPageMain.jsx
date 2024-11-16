import React, { useState, useMemo, useCallback } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FiSearch, FiCalendar, FiClock, FiUser } from "react-icons/fi";
import esES from "date-fns/locale/es";

const locales = {
    "es": esES
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
        className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow duration-200"
        aria-label={`Cita con ${appointment.patientName}`}
    >
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-semibold text-lg">{appointment.patientName}</h3>
                <p className="text-gray-600">{appointment.title}</p>
                <p className="text-gray-500 text-sm">{appointment.reason}</p>
            </div>
            <div className="text-right">
                <p className="text-theme-color-primary">
                    <FiClock className="inline-block mr-1" />
                    {format(appointment.start, "h:mm a", { locale: esES })}
                </p>
                <p className="text-gray-500">{format(appointment.start, "d MMM yyyy", { locale: esES })}</p>
                <button
                    onClick={() => onComplete(appointment.id)}
                    className="mt-2 text-sm bg-theme-color-primary text-white px-3 py-1 rounded-md hover:bg-theme-color-primary-dark transition-colors duration-200"
                    aria-label={`Marcar cita con ${appointment.patientName} como completada`}
                >
                    Completar
                </button>
            </div>
        </div>
    </div>
);

const CalendarEvent = ({ event }) => (
    <div className="p-1">
        <strong className="block text-sm">{event.patientName}</strong>
        <span className="text-xs text-gray-600">{event.title}</span>
        <span className="text-xs block text-gray-500">{format(event.start, "h:mm a", { locale: esES })}</span>
    </div>
);

const DashboardPageMain = () => {
    const dummyAppointments = useMemo(
        () => [
            {
                id: 1,
                title: "Chequeo Regular",
                patientName: "Juan Pérez",
                start: new Date(2024, 0, 15, 10, 0),
                end: new Date(2024, 0, 15, 11, 0),
                reason: "Chequeo anual de salud",
            },
            {
                id: 2,
                title: "Limpieza Dental",
                patientName: "María García",
                start: new Date(2024, 0, 16, 14, 30),
                end: new Date(2024, 0, 16, 15, 30),
                reason: "Limpieza dental regular",
            },
            {
                id: 3,
                title: "Terapia Física",
                patientName: "Miguel Rodríguez",
                start: new Date(2024, 0, 17, 9, 0),
                end: new Date(2024, 0, 17, 10, 0),
                reason: "Tratamiento del dolor de espalda",
            },
        ],
        []
    );

    const [appointments, setAppointments] = useState(dummyAppointments);
    const [searchTerm, setSearchTerm] = useState("");
    const [view, setView] = useState("month");
    const [sortBy, setSortBy] = useState("date");

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
        showMore: total => `+ Ver más (${total})`
    };

    const handleSearch = useCallback(
        (e) => {
            const term = e.target.value.toLowerCase();
            setSearchTerm(term);
            const filtered = dummyAppointments.filter(
                (apt) =>
                    apt.patientName.toLowerCase().includes(term) ||
                    apt.reason.toLowerCase().includes(term)
            );
            setAppointments(filtered);
        },
        [dummyAppointments]
    );

    const handleSort = useCallback(
        (type) => {
            setSortBy(type);
            const sorted = [...appointments].sort((a, b) => {
                if (type === "date") {
                    return a.start - b.start;
                } else {
                    return a.patientName.localeCompare(b.patientName);
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

    const viewLabels = {
        month: "Mes",
        week: "Semana",
        day: "Día"
    };

    return (
        <div className="min-h-screen bg-theme-color-base p-4">
            <header className="bg-theme-color-primary rounded-lg p-6 mb-6 shadow-lg">
                <h1 className="text-3xl font-bold text-white mb-4">Citas Pendientes</h1>
                <nav className="flex space-x-4">
                    {["month", "week", "day"].map((viewOption) => (
                        <button
                            key={viewOption}
                            className={`px-4 py-2 rounded-md ${
                                view === viewOption
                                    ? "bg-theme-color-primary-content text-theme-color-base"
                                    : "bg-white text-theme-color-primary"
                            } hover:bg-theme-color-primary-content transition-colors duration-200`}
                            onClick={() => setView(viewOption)}
                            aria-label={`Cambiar a vista de ${viewLabels[viewOption]}`}
                        >
                            Vista de {viewLabels[viewOption]}
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
                                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-theme-color-primary"
                                value={searchTerm}
                                onChange={handleSearch}
                                aria-label="Buscar citas"
                            />
                        </div>
                        <div className="flex space-x-2">
                            {[{type: "date", label: "Fecha"}, {type: "name", label: "Nombre"}].map(({type, label}) => (
                                <button
                                    key={type}
                                    onClick={() => handleSort(type)}
                                    className={`px-4 py-2 rounded-md ${
                                        sortBy === type
                                            ? "bg-theme-color-primary text-white"
                                            : "bg-gray-100"
                                    }`}
                                    aria-label={`Ordenar por ${label}`}
                                >
                                    {type === "date" ? (
                                        <FiCalendar className="inline-block mr-2" />
                                    ) : (
                                        <FiUser className="inline-block mr-2" />
                                    )}
                                    {label}
                                </button>
                            ))}
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
                        events={appointments}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 600 }}
                        view={view}
                        onView={(newView) => setView(newView)}
                        components={{
                            event: CalendarEvent
                        }}
                        messages={messages}
                        eventPropGetter={(event) => ({
                            className: "bg-theme-color-primary text-white rounded-md p-1"
                        })}
                        tooltipAccessor={(event) => `${event.patientName} - ${event.reason}`}
                        className="rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardPageMain;