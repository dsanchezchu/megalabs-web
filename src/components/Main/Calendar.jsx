import React, { useState, useEffect, useMemo } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import {
  programarCita,
  cancelarCita,
  obtenerCitasPorRepresentante,
  actualizarCita,
} from "../../services/CalendarService";
import { format, isSameDay, isBefore, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { es } from "date-fns/locale";

const EventModal = ({ onClose, onSubmit, motivos, eventDetails, setEventDetails, title, mode }) => {
  const isReadOnly = eventDetails.estado === "INASISTENCIA";

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              aria-label="Close"
          >
            <FaTimes className="w-6 h-6" />
          </button>
          <form onSubmit={onSubmit}>
            <div className="space-y-4">
              {/* Mostrar el nombre solo si está en modo edición */}
              {mode === "edit" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre del Cliente</label>
                    <input
                        type="text"
                        value={eventDetails.nombreCliente || ""} // Si está vacío, muestra ""
                        className="input input-bordered w-full"
                        readOnly // Deshabilitado en modo edición
                    />
                  </div>
              )}
              {/* Motivo */}
              <div>
                <label className="block text-sm font-medium mb-1">Motivo</label>
                <select
                    value={eventDetails.motivo}
                    onChange={(e) =>
                        setEventDetails((prev) => ({ ...prev, motivo: e.target.value }))
                    }
                    className="input input-bordered w-full"
                    disabled={isReadOnly}
                    required
                >
                  {motivos.map((motivo) => (
                      <option key={motivo} value={motivo}>
                        {motivo}
                      </option>
                  ))}
                </select>
              </div>
              {/* Hora de la Cita */}
              <div>
                <label className="block text-sm font-medium mb-1">Hora de la Cita</label>
                <input
                    type="time"
                    value={eventDetails.fechaHora.split("T")[1]?.substring(0, 5)}
                    onChange={(e) => {
                      const fechaBase = eventDetails.fechaHora.split("T")[0];
                      const nuevaHora = e.target.value;
                      if (nuevaHora) {
                        setEventDetails((prev) => ({
                          ...prev,
                          fechaHora: `${fechaBase}T${nuevaHora}:00`,
                        }));
                      }
                    }}
                    className="input input-bordered w-full"
                    disabled={isReadOnly}
                    required
                />
              </div>
              {/* Estado */}
              <div>
                <label className="block text-sm font-medium mb-1">Estado</label>
                <select
                    value={eventDetails.estado}
                    onChange={(e) =>
                        setEventDetails((prev) => ({ ...prev, estado: e.target.value }))
                    }
                    className="input input-bordered w-full"
                    disabled={isReadOnly}
                >
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="ASISTENCIA">ASISTENCIA</option>
                  <option value="INASISTENCIA">INASISTENCIA</option>
                </select>
              </div>
              {/* Botones */}
              {!isReadOnly && (
                  <div className="flex justify-between">
                    <button type="submit" className="btn btn-primary">
                      Guardar Cambios
                    </button>
                    <button type="button" onClick={onClose} className="btn btn-error">
                      Cancelar
                    </button>
                  </div>
              )}
            </div>
          </form>
        </div>
      </div>
  );
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    nombreCliente: "",
    motivo: "NINGUNO",
    fechaHora: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    estado: "PENDIENTE",
  });
  const [editEvent, setEditEvent] = useState(null);
  const [dniRepresentante, setDniRepresentante] = useState("");

  const motivos = [
    "NINGUNO",
    "ENTREGA_DE_MUESTRAS",
    "RECOJO_DE_ESTUDIOS",
    "GENERACION_DE_ORDEN_DE_COMPRA",
  ];

  // Navegar entre meses
  const navigateMonth = (direction) => {
    setCurrentDate((prevDate) => {
      const updatedDate = new Date(prevDate);
      updatedDate.setMonth(updatedDate.getMonth() + direction);
      return updatedDate;
    });
  };

  // Cargar el DNI desde localStorage
  useEffect(() => {
    const dni = localStorage.getItem("dni");
    setDniRepresentante(dni);
  }, []);

  // Obtener las citas desde la API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await obtenerCitasPorRepresentante(dniRepresentante);
        const updatedEvents = fetchedEvents.map((event) => ({
          ...event,
          nombreCliente: event.clienteNombre || "", // Asegúrate de incluir el nombre del cliente
          colorClass:
              event.estado === "INASISTENCIA"
                  ? "bg-red-200 text-red-800"
                  : event.estado === "ASISTENCIA"
                      ? "bg-green-200 text-green-800"
                      : "bg-blue-200 text-blue-800",
        }));
        setEvents(updatedEvents);

      } catch (error) {
        console.error("Error al cargar las citas:", error);
      }
    };

    if (dniRepresentante) fetchEvents();
  }, [dniRepresentante]);

  // Programar nueva cita
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
      setNewEvent({
        nombreCliente: "",
        motivo: "NINGUNO",
        fechaHora: "",
        estado: "PENDIENTE",
      });

      alert("Cita programada correctamente.");
    } catch (error) {
      console.error("Error al programar la cita:", error);
      alert("Hubo un error al programar la cita.");
    }
  };

  // Editar cita
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const updatedEventData = {
      motivo: editEvent.motivo,
      fechaHora: editEvent.fechaHora,
      estado: editEvent.estado,
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
      setEditEvent(null);
      alert("La cita ha sido actualizada correctamente.");
    } catch (error) {
      console.error("Error al actualizar la cita:", error);
      alert("Hubo un error al guardar los cambios.");
    }
  };

  // Cancelar cita
  const handleCancelEvent = async () => {
    if (!editEvent) {
      alert("No se seleccionó ninguna cita para cancelar.");
      return;
    }

    try {
      const canceledEvent = await cancelarCita(editEvent.id);

      setEvents(
          events.map((event) =>
              event.id === canceledEvent.id
                  ? { ...canceledEvent, colorClass: getColorClass(canceledEvent.estado) }
                  : event
          )
      );

      setShowEditModal(false);
      setEditEvent(null);
      alert("La cita ha sido cancelada correctamente.");
    } catch (error) {
      console.error("Error al cancelar la cita:", error);
      alert("Hubo un error al cancelar la cita.");
    }
  };

  // Determinar color según estado
  const getColorClass = (estado) => {
    switch (estado) {
      case "INASISTENCIA":
        return "bg-red-200 text-red-800";
      case "ASISTENCIA":
        return "bg-green-200 text-green-800";
      default:
        return "bg-blue-200 text-blue-800";
    }
  };

  // Renderizar el calendario
  const RenderCalendar = () => {
    const daysInMonth = useMemo(() => {
      return eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
      });
    }, [currentDate]);

    const firstDayOfMonth = daysInMonth[0].getDay();
    const blanks = Array(firstDayOfMonth).fill(null);

    return [...blanks, ...daysInMonth].map((day, index) => {
      const dayEvents = events.filter((event) =>
          isSameDay(new Date(event.fechaHora), day)
      );

      return (
          <div
              key={day?.toISOString() || `blank-${index}`}
              className={`p-4 border border-gray-300 ${
                  day ? "bg-white" : "bg-gray-100"
              } rounded-lg shadow hover:shadow-lg transition cursor-pointer min-h-[140px] overflow-hidden`}
              onClick={() => day && handleDateClick(day)}
          >
            {day && (
                <>
              <span className="block font-bold text-lg text-gray-700">
                {format(day, "d")}
              </span>
                  <div className="mt-2 space-y-2 max-h-[100px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    {dayEvents.map((event) => (
                        <div
                            key={event.id}
                            className={`p-2 rounded-lg text-sm truncate flex items-center justify-between ${event.colorClass} hover:bg-opacity-90`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditEvent(event);
                              setShowEditModal(true);
                            }}
                        >
                          {event.clienteNombre} - {event.motivo}
                        </div>
                    ))}
                  </div>
                </>
            )}
          </div>
      );
    });
  };

  // Manejar clic en fecha
  const handleDateClick = (day) => {
    const now = new Date();
    if (isBefore(day, now.setHours(0, 0, 0, 0))) {
      alert("No puedes programar citas en un día anterior al actual.");
      return;
    }

    setSelectedDate(day);
    setShowEventModal(true);
  };

  return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => navigateMonth(-1)} className="btn btn-circle">
              <FaChevronLeft />
            </button>
            <h2 className="text-3xl font-bold capitalize">
              {format(currentDate, "MMMM yyyy", { locale: es })}
            </h2>
            <button onClick={() => navigateMonth(1)} className="btn btn-circle">
              <FaChevronRight />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-4">
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                <div key={day} className="p-4 font-semibold text-center text-gray-500 uppercase text-lg">
                  {day}
                </div>
            ))}
            {RenderCalendar()}
          </div>
        </div>

        {showEventModal && (
            <EventModal
                onClose={() => setShowEventModal(false)}
                onSubmit={handleEventSubmit}
                motivos={motivos}
                eventDetails={newEvent}
                setEventDetails={setNewEvent}
                title="Programar Nueva Cita"
                mode="create"
            />
        )}

        {showEditModal && editEvent && (
            <EventModal
                onClose={() => {
                  setShowEditModal(false);
                  setEditEvent(null);
                }}
                onSubmit={handleEditSubmit}
                motivos={motivos}
                eventDetails={editEvent}
                setEventDetails={setEditEvent}
                title="Editar Cita"
                mode="edit"
            />
        )}
      </div>
  );
};

export default Calendar;
