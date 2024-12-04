import React, { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaShareAlt, FaFacebook, FaWhatsapp, FaEnvelope, FaLink } from "react-icons/fa";
import { toPng } from "html-to-image";
import CalendarGrid from "./CalendarGrid";
import EventModal from "../Calendar/EventModal/EventModal";
import { format, addMonths, startOfMonth, isSameMonth, isSameDay, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { obtenerCitasPorRepresentante, programarCita, actualizarCita } from "../../services/CalendarService";
import { getColorClass, isPastDate } from "../../Utils/dateUtils";
import { showErrorAlert, showSuccessAlert, showConfirmDialog, showWarningAlert } from '../../services/AlertService';
import './Calendar.css';
import { fetchClientes } from "../../services/ClientesService";

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
    const [showShareMenu, setShowShareMenu] = useState(false);

    const calendarRef = useRef(null);
    const [imageUrl, setImageUrl] = useState(null); // Guardar la URL de ImgBB

    const motivos = ["NINGUNO", "ENTREGA_DE_MUESTRAS", "RECOJO_DE_ESTUDIOS", "GENERACION_DE_ORDEN_DE_COMPRA"];

    const [clientes, setClientes] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState(null);

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

    useEffect(() => {
        const obtenerClientes = async () => {
            try {
                const clientesData = await fetchClientes();
                const clientesFormateados = clientesData.map(cliente => ({
                    value: cliente.id,
                    label: cliente.nombre
                }));
                setClientes(clientesFormateados);
            } catch (error) {
                console.error("Error al obtener clientes:", error);
                showErrorAlert("Error al cargar la lista de clientes");
            }
        };
        obtenerClientes();
    }, []);

    const navigateMonth = (direction) => {
        setCurrentDate(prevDate => addMonths(prevDate, direction));
    };

    const handleDateClick = (day) => {
        if (isPastDate(day)) {
            showWarningAlert("No puedes programar citas en días pasados.");
            return;
        }
        setSelectedDate(day);
        setSelectedCliente(null); // Resetear cliente seleccionado
        setNewEvent({
            nombreCliente: "",
            motivo: "NINGUNO",
            fechaHora: format(day, "yyyy-MM-dd'T'HH:mm:ss"),
            estado: "PENDIENTE",
        });
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
            // Verifica y establece un nombre predeterminado si no está disponible
            const eventWithDefaults = {
                ...newEventData,
                nombreCliente: newEventData.nombreCliente || "Nombre no disponible",
                colorClass: getColorClass(newEventData.estado),
            };

            setEvents([...events, eventWithDefaults]);
            setShowEventModal(false);
            await showSuccessAlert("Cita programada exitosamente");
        } catch (error) {
            showErrorAlert("Error al programar la cita");
        }
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
            await showSuccessAlert("Cita actualizada exitosamente");
        } catch (error) {
            console.error("Error al guardar los cambios:", error);
            showErrorAlert("Hubo un error al guardar los cambios");
        }
    };

    const uploadToImgBB = async (base64Image) => {
        try {
            const formData = new FormData();
            formData.append("key", "86bd66088dbbba19a1091dff202fc036"); // Tu API Key de ImgBB
            formData.append("image", base64Image.split(",")[1]); // Base64 sin prefijo

            const response = await fetch("https://api.imgbb.com/1/upload", {
                method: "POST",
                body: formData, // Enviar como FormData
            });

            if (!response.ok) throw new Error("Error al subir la imagen a ImgBB.");

            const data = await response.json();
            return data.data.url; // URL pública de la imagen en ImgBB
        } catch (error) {
            console.error("Error al subir la imagen a ImgBB:", error);
            return null;
        }
    };

    const handleShareCalendar = async () => {
        if (imageUrl) {
            // Si la imagen ya fue subida, reutilizar su URL
            console.log("Imagen ya subida. URL:", imageUrl);
            return imageUrl;
        }

        if (calendarRef.current) {
            try {
                // Generar imagen como Base64 usando `toPng`
                const dataUrl = await toPng(calendarRef.current);

                // Subir la imagen generada a ImgBB
                const uploadedUrl = await uploadToImgBB(dataUrl);

                if (uploadedUrl) {
                    console.log("Imagen subida a ImgBB:", uploadedUrl);
                    setImageUrl(uploadedUrl);
                    await showSuccessAlert('Imagen subida exitosamente a ImgBB');
                    return uploadedUrl;
                } else {
                    showErrorAlert('Hubo un error al subir la imagen a ImgBB.');
                    return null;
                }
            } catch (error) {
                console.error("Error al generar o subir la imagen:", error);
                showErrorAlert('Hubo un error al generar o subir la imagen del calendario.');
                return null;
            }
        }
    };

    const handleShareToWhatsApp = async () => {
        const url = await handleShareCalendar();
        if (url) {
            const message = `¡Hola! Aquí está mi calendario: ${url}`;
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, "_blank");
        } else {
            showErrorAlert('Hubo un error al compartir en WhatsApp.');
        }
    };

    const handleShareByEmail = async () => {
        const url = await handleShareCalendar();
        if (url) {
            const subject = encodeURIComponent('Mi Calendario de Citas');
            const body = encodeURIComponent(`¡Hola! Aquí está mi calendario de citas: ${url}`);
            
            // Intentar abrir Gmail primero
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;
            
            // Abrir en una nueva pestaña
            window.open(gmailUrl, '_blank');
            
            // Si Gmail no se abre después de un segundo, intentar con mailto
            setTimeout(() => {
                if (!document.hasFocus()) {
                    window.location.href = `mailto:?subject=${subject}&body=${body}`;
                }
            }, 1000);
        } else {
            showErrorAlert('Hubo un error al compartir por correo electrónico.');
        }
    };

    const handleCopyLink = async () => {
        const url = await handleShareCalendar();
        if (url) {
            navigator.clipboard.writeText(url);
            await showSuccessAlert("El enlace al calendario ha sido copiado al portapapeles");
        } else {
            showErrorAlert("Hubo un error al copiar el enlace");
        }
    };

    const handleClienteChange = (newValue) => {
        setSelectedCliente(newValue);
        if (showEventModal) {
            setNewEvent(prevEvent => ({
                ...prevEvent,
                nombreCliente: newValue ? newValue.label : ""
            }));
        } else if (showEditModal) {
            setEditEvent(prevEvent => ({
                ...prevEvent,
                nombreCliente: newValue ? newValue.label : ""
            }));
        }
    };

    const handleEditClick = (event) => {
        const clienteSeleccionado = clientes.find(
            cliente => cliente.label === (event.clienteNombre || event.nombreCliente)
        );
        
        setSelectedCliente(clienteSeleccionado);
        setEditEvent({
            ...event,
            nombreCliente: event.clienteNombre || event.nombreCliente || "Nombre no disponible",
        });
        setShowEditModal(true);
    };

    const RenderCalendar = () => {
        const start = startOfMonth(currentDate);
        const days = [];
        const daysInWeek = 7;
        const firstDayOfMonth = start.getDay();

        // Agregar días del mes anterior para completar la primera semana
        for (let i = 0; i < firstDayOfMonth; i++) {
            const prevDay = addDays(start, -1 * (firstDayOfMonth - i));
            days.push({
                date: prevDay,
                isCurrentMonth: false
            });
        }

        // Agregar días del mes actual
        let currentDay = start;
        while (isSameMonth(currentDay, currentDate)) {
            days.push({
                date: currentDay,
                isCurrentMonth: true
            });
            currentDay = addDays(currentDay, 1);
        }

        // Agregar días del mes siguiente hasta completar la última semana
        const remainingDays = (daysInWeek - (days.length % daysInWeek)) % daysInWeek;
        for (let i = 0; i < remainingDays; i++) {
            days.push({
                date: addDays(currentDay, i),
                isCurrentMonth: false
            });
        }

        return days.map((day, index) => {
            const dayEvents = events.filter(event =>
                isSameDay(new Date(event.fechaHora), day.date)
            );

            return (
                <div
                    key={day.date.toISOString()}
                    className={`p-4 border border-gray-200 ${
                        day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                    } ${isSameDay(day.date, new Date()) ? 'ring-2 ring-green-500' : ''} 
                    rounded-lg shadow hover:shadow-md transition-all duration-200 
                    cursor-pointer min-h-[120px] relative`}
                    onClick={() => handleDateClick(day.date)}
                >
                    <span className={`block font-semibold text-lg ${
                        day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                        {format(day.date, 'd')}
                    </span>
                    <div className="mt-2 space-y-1 max-h-[80px] overflow-y-auto">
                        {dayEvents.map((event) => (
                            <div
                                key={event.id}
                                className={`p-2 rounded-lg text-sm truncate ${event.colorClass}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClick(event);
                                }}
                            >
                                <span className="block truncate">
                                    {event.clienteNombre || event.nombreCliente}
                                </span>
                                <span className="text-xs opacity-75">
                                    {format(new Date(event.fechaHora), 'HH:mm')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div ref={calendarRef} className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center justify-between mb-8">
                    <button 
                        onClick={() => navigateMonth(-1)} 
                        className="btn btn-circle btn-outline hover:bg-green-50"
                    >
                        <FaChevronLeft className="text-green-600" />
                    </button>
                    <h2 className="text-2xl md:text-3xl font-bold capitalize text-green-700">
                        {format(currentDate, "MMMM yyyy", { locale: es })}
                    </h2>
                    <button 
                        onClick={() => navigateMonth(1)} 
                        className="btn btn-circle btn-outline hover:bg-green-50"
                    >
                        <FaChevronRight className="text-green-600" />
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-4">
                    {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                        <div key={day} className="p-4 font-semibold text-center text-gray-500">
                            {day}
                        </div>
                    ))}
                    {RenderCalendar()}
                </div>
                <div className="mt-4 text-right relative">
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowShareMenu((prev) => !prev)}
                    >
                        <FaShareAlt className="mr-2" />
                        Compartir
                    </button>
                    {showShareMenu && (
                        <div className="absolute right-0 mt-2 p-4 bg-white shadow-lg rounded-lg w-48">
                            <button
                                className="flex items-center mb-2 w-full"
                                onClick={handleShareToWhatsApp}
                            >
                                <FaWhatsapp className="mr-2 text-green-500" /> WhatsApp
                            </button>
                            <button 
                                className="flex items-center mb-2 w-full"
                                onClick={handleShareByEmail}
                            >
                                <FaEnvelope className="mr-2 text-red-500" /> Correo
                            </button>
                            <button 
                                className="flex items-center mb-2 w-full" 
                                onClick={() => handleCopyLink()}
                            >
                                <FaLink className="mr-2 text-blue-500" /> Copiar Enlace
                            </button>
                        </div>
                    )}
                </div>
                {showEventModal && (
                    <EventModal
                        eventDetails={newEvent}
                        setEventDetails={setNewEvent}
                        onClose={() => {
                            setShowEventModal(false);
                            setSelectedCliente(null); // Limpiar cliente seleccionado al cerrar
                        }}
                        title="Nueva Cita"
                        mode="create"
                        motivos={motivos}
                        onSubmit={handleEventSubmit}
                        clientes={clientes || []}
                        selectedCliente={selectedCliente}
                        onClienteChange={handleClienteChange}
                    />
                )}
                {showEditModal && editEvent && (
                    <EventModal
                        eventDetails={editEvent}
                        setEventDetails={setEditEvent}
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedCliente(null);
                            setEditEvent(null);
                        }}
                        title="Editar Cita"
                        mode="edit"
                        motivos={motivos}
                        onSubmit={handleEditSubmit}
                        clientes={clientes || []}
                        selectedCliente={selectedCliente}
                        onClienteChange={handleClienteChange}
                    />
                )}
            </div>
        </div>
    );
};

export default Calendar;