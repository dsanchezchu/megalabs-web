import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes, FaTrash } from "react-icons/fa";
import { programarCita, cancelarCita } from "../../services/CalendarService"; // Asegúrate de que la ruta sea correcta

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    nombreCliente: "",
    motivo: "",
    fechaHora: "",
  });

  // Obtener eventos al montar el componente
  useEffect(() => {
    // Aquí puedes agregar una función para obtener eventos desde la API si es necesario
    // setEvents(eventsData); // Actualiza el estado con los eventos obtenidos
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const navigateMonth = (direction) => {
    setCurrentDate(
      new Date(currentDate.setMonth(currentDate.getMonth() + direction))
    );
  };

  const handleDateClick = (day) => {
    setSelectedDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    );
    setShowEventModal(true);
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();

    const fechaHora = `${selectedDate.toISOString().split("T")[0]}T${newEvent.fechaHora}`;

    try {
      // Llamar al servicio para programar la cita
      const data = await programarCita(newEvent.nombreCliente, newEvent.motivo, fechaHora);

      // Actualizar eventos después de programar la cita
      setEvents([...events, data]);
      setShowEventModal(false);
      setNewEvent({ nombreCliente: "", motivo: "", fechaHora: "" });
    } catch (error) {
      console.error("Error al programar la cita", error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      // Llamar al servicio para cancelar la cita
      await cancelarCita(id);

      // Eliminar evento del estado
      const updatedEvents = events.filter((event) => event.id !== id);
      setEvents(updatedEvents);
    } catch (error) {
      console.error("Error al cancelar la cita", error);
    }
  };

  const renderCalendar = () => {
    const { days, firstDay } = getDaysInMonth(currentDate);
    const blanks = Array(firstDay).fill(null);
    const daysArray = Array.from({ length: days }, (_, i) => i + 1);

    return [...blanks, ...daysArray].map((day, index) => {
      if (!day) return <div key={`blank-${index}`} className="p-4" />;

      const currentDateEvents = events.filter(
        (event) =>
          new Date(event.fechaHora).getDate() === day &&
          new Date(event.fechaHora).getMonth() === currentDate.getMonth() &&
          new Date(event.fechaHora).getFullYear() === currentDate.getFullYear()
      );

      return (
        <div
          key={day}
          className="p-4 border border-gray-200 min-h-[100px] relative cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => handleDateClick(day)}
        >
          <span className="font-semibold">{day}</span>
          <div className="mt-2 space-y-1">
            {currentDateEvents.map((event) => (
              <div
                key={event.id}
                className="bg-theme-color-primary text-black p-1 rounded text-sm truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {event.nombreCliente} - {event.motivo}
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
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
          >
            <FaChevronLeft />
          </button>
          <h2 className="text-xl font-bold">
            {currentDate.toLocaleDateString("es-ES", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
              <h3 className="text-lg font-semibold">Programar Nueva Cita</h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleEventSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre del Cliente</label>
                  <input
                    type="text"
                    value={newEvent.nombreCliente}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, nombreCliente: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Motivo</label>
                  <input
                    type="text"
                    value={newEvent.motivo}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, motivo: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha y Hora</label>
                  <input
                    type="datetime-local"
                    value={newEvent.fechaHora}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, fechaHora: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Programar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
