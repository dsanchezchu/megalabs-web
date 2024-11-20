import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CalendarGrid from "./CalendarGrid";
import EventModal from "../EventModal/EventModal";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { obtenerCitasPorRepresentante, programarCita, actualizarCita } from "../../services/CalendarService";
import {getColorClass, isPastDate} from "../../Utils/dateUtils";

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [dniRepresentante, setDniRepresentante] = useState("");
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [newEvent, setNewEvent] = useState({
        nombreCliente: "",
        motivo: "NINGUNO",
        fechaHora: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        estado: "PENDIENTE",
    });
    const [editEvent, setEditEvent] = useState(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const motivos = ["NINGUNO", "ENTREGA_DE_MUESTRAS", "RECOJO_DE_ESTUDIOS", "GENERACION_DE_ORDEN_DE_COMPRA"];

    useEffect(() => {
        const dni = localStorage.getItem("dni");
        setDniRepresentante(dni);
    }, []);

    useEffect(() => {
    const fetchEvents = async () => {
        if (dniRepresentante) {
            try {
                const fetchedEvents = await obtenerCitasPorRepresentante(dniRepresentante);
                const updatedEvents = fetchedEvents.map((event) => ({
                    ...event,
                    nombreCliente: event.nombreCliente || "Nombre no disponible", // Fallback en frontend
                    colorClass: getColorClass(event.estado),
                }));
                setEvents(updatedEvents);
            } catch (error) {
                console.error("Error al cargar las citas:", error);
            }
        }
    };
    fetchEvents();
}, [dniRepresentante]);


    const navigateMonth = (direction) => {
        setCurrentDate((prevDate) => new Date(prevDate.setMonth(prevDate.getMonth() + direction)));
    };

    const handleDateClick = (day) => {
        if (isPastDate(day)) {
            alert("No puedes programar citas en días pasados.");
            return;
        }
        setSelectedDate(day);
        setShowEventModal(true);
    };

    const handleEventSubmit = async (e) => {
        e.preventDefault();
        const fechaCompleta = `${format(selectedDate, "yyyy-MM-dd")}T${newEvent.fechaHora.split("T")[1]}`;
        try {
            const newEventData = await programarCita(
                newEvent.nombreCliente,
                newEvent.motivo,
                fechaCompleta,
                dniRepresentante
            );
            setEvents([...events, { ...newEventData, colorClass: getColorClass(newEventData.estado) }]);
            setShowEventModal(false);
        } catch (error) {
            alert("Error al programar la cita.");
        }
    };

  const handleEditEvent = (event) => {
    const updatedEvent = {
        ...event,
        nombreCliente: event.nombreCliente || "Nombre no disponible", // Fallback antes de editar
    };
    setEditEvent(updatedEvent);
    setShowEditModal(true);
};


    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const updatedEventData = {
            nombreCliente: editEvent.nombreCliente, // Ahora incluye el nombre del cliente
            motivo: editEvent.motivo,
            fechaHora: editEvent.fechaHora,
            estado: editEvent.estado, // Incluye el estado
        };

        try {
            const updatedEvent = await actualizarCita(editEvent.id, updatedEventData);

            setEvents(
                events.map((event) =>
                    event.id === updatedEvent.id
                        ? { ...updatedEvent, colorClass: getColorClass(updatedEvent.estado) }
                        : event
                )
            );

            setShowEditModal(false);
        } catch (error) {
            console.error("Error al guardar los cambios:", error);
            alert("Hubo un error al guardar los cambios.");
        }
    };


    return (
        <div className="p-4 bg-base-200 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <button className="btn btn-circle btn-outline" onClick={() => navigateMonth(-1)}>
                    <FaChevronLeft />
                </button>
                <h2 className="text-2xl font-bold">
                    {format(currentDate, "MMMM yyyy", { locale: es })}
                </h2>
                <button className="btn btn-circle btn-outline" onClick={() => navigateMonth(1)}>
                    <FaChevronRight />
                </button>
            </div>
            <CalendarGrid
                currentDate={currentDate}
                events={events}
                onDateClick={handleDateClick}
                onEditEvent={(event) => {
                    setEditEvent(event);
                    setShowEditModal(true);
                }}
            />
            {showEventModal && (
                <EventModal
                    eventDetails={newEvent}
                    setEventDetails={setNewEvent}
                    onClose={() => setShowEventModal(false)}
                    title="Nueva Cita"
                    mode="create"
                    motivos={motivos}
                    onSubmit={handleEventSubmit}
                />
            )}
            {showEditModal && editEvent && (
                <EventModal
                    eventDetails={editEvent}
                    setEventDetails={setEditEvent}
                    onClose={() => setShowEditModal(false)}
                    title="Editar Cita"
                    mode="edit"
                    motivos={motivos}
                    onSubmit={handleEditSubmit}
                />
            )}
        </div>
    );
};

export default Calendar;