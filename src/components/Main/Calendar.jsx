import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
        title: "",
        description: "",
        category: "trabajo",
        time: ""
    });

    const categories = {
        trabajo: "bg-theme-color-primary",
        personal: "bg-blue-500",
        reunión: "bg-purple-500",
        feriado: "bg-red-500"
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const navigateMonth = (direction) => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + direction)));
    };

    const handleDateClick = (day) => {
        setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
        setShowEventModal(true);
    };

    const handleEventSubmit = (e) => {
        e.preventDefault();
        const eventData = {
            ...newEvent,
            date: selectedDate,
            id: Date.now()
        };
        setEvents([...events, eventData]);
        setShowEventModal(false);
        setNewEvent({ title: "", description: "", category: "trabajo", time: "" });
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setShowEventDetailsModal(true);
    };

    const deleteEvent = (eventId) => {
        setEvents(events.filter((event) => event.id !== eventId));
        setShowEventDetailsModal(false);
    };

    const renderCalendar = () => {
        const { days, firstDay } = getDaysInMonth(currentDate);
        const blanks = Array(firstDay).fill(null);
        const daysArray = Array.from({ length: days }, (_, i) => i + 1);

        return [...blanks, ...daysArray].map((day, index) => {
            if (!day) return <div key={`blank-${index}`} className="p-4" />;

            const currentDateEvents = events.filter(
                (event) =>
                    event.date.getDate() === day &&
                    event.date.getMonth() === currentDate.getMonth() &&
                    event.date.getFullYear() === currentDate.getFullYear()
            );

            return (
                <div
                    key={day}
                    className="p-4 border border-gray-200 min-h-[100px] relative cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleDateClick(day)}
                    role="button"
                    tabIndex="0"
                    aria-label={`Seleccionar fecha ${day}`}
                >
                    <span className="font-semibold">{day}</span>
                    <div className="mt-2 space-y-1">
                        {currentDateEvents.map((event) => (
                            <div
                                key={event.id}
                                className={`${categories[event.category]} text-white p-1 rounded text-sm truncate`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEventClick(event);
                                }}
                                role="button"
                                tabIndex="0"
                                aria-label={`Ver evento: ${event.title}`}
                            >
                                {event.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Mes anterior"
                    >
                        <FaChevronLeft />
                    </button>
                    <h2 className="text-xl font-bold">
                        {currentDate.toLocaleDateString("es-ES", {
                            month: "long",
                            year: "numeric"
                        })}
                    </h2>
                    <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Mes siguiente"
                    >
                        <FaChevronRight />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-px">
                    {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                        <div key={day} className="p-4 font-semibold text-center">
                            {day}
                        </div>
                    ))}
                    {renderCalendar()}
                </div>
            </div>

            {showEventModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Añadir Nuevo Evento</h3>
                            <button
                                onClick={() => setShowEventModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                                aria-label="Cerrar modal"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleEventSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Título</label>
                                    <input
                                        type="text"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Descripción</label>
                                    <textarea
                                        value={newEvent.description}
                                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Categoría</label>
                                    <select
                                        value={newEvent.category}
                                        onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="trabajo">Trabajo</option>
                                        <option value="personal">Personal</option>
                                        <option value="reunión">Reunión</option>
                                        <option value="feriado">Feriado</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Hora</label>
                                    <input
                                        type="time"
                                        value={newEvent.time}
                                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-theme-color-primary text-white p-2 rounded hover:bg-theme-color-primary-dark transition-colors"
                                >
                                    Añadir Evento
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEventDetailsModal && selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Detalles del Evento</h3>
                            <button
                                onClick={() => setShowEventDetailsModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                                aria-label="Cerrar modal"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium">Título</h4>
                                <p>{selectedEvent.title}</p>
                            </div>
                            <div>
                                <h4 className="font-medium">Descripción</h4>
                                <p>{selectedEvent.description}</p>
                            </div>
                            <div>
                                <h4 className="font-medium">Categoría</h4>
                                <p className="capitalize">{selectedEvent.category}</p>
                            </div>
                            <div>
                                <h4 className="font-medium">Hora</h4>
                                <p>{selectedEvent.time}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => deleteEvent(selectedEvent.id)}
                                    className="flex items-center space-x-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                >
                                    <FaTrash />
                                    <span>Eliminar</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
