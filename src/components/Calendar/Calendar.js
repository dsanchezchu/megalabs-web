import React, { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaShareAlt, FaFacebook, FaWhatsapp, FaEnvelope, FaLink } from "react-icons/fa";
import { toPng } from "html-to-image";
import CalendarGrid from "./CalendarGrid";
import EventModal from "./EventModal/EventModal";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { obtenerCitasPorRepresentante, programarCita, actualizarCita } from "../../services/CalendarService";
import { getColorClass, isPastDate } from "../../Utils/dateUtils";

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
            // Verifica y establece un nombre predeterminado si no está disponible
            const eventWithDefaults = {
                ...newEventData,
                nombreCliente: newEventData.nombreCliente || "Nombre no disponible",
                colorClass: getColorClass(newEventData.estado),
            };

            setEvents([...events, eventWithDefaults]);
            setShowEventModal(false);
        } catch (error) {
            alert("Error al programar la cita.");
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
        } catch (error) {
            console.error("Error al guardar los cambios:", error);
            alert("Hubo un error al guardar los cambios.");
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
                    setImageUrl(uploadedUrl); // Guardar la URL en el estado
                    return uploadedUrl;
                } else {
                    alert("Hubo un error al subir la imagen a ImgBB.");
                    return null;
                }
            } catch (error) {
                console.error("Error al generar o subir la imagen:", error);
                alert("Hubo un error al generar o subir la imagen del calendario.");
                return null;
            }
        }
    };

    const handleShareToWhatsApp = async () => {
        const url = await handleShareCalendar(); // Reutilizar la URL si ya existe
        if (url) {
            const message = `¡Hola! Aquí está mi calendario: ${url}`;
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, "_blank");
        } else {
            alert("Hubo un error al compartir en WhatsApp.");
        }
    };

    const handleCopyLink = async () => {
        const url = await handleShareCalendar(); // Reutilizar la URL si ya existe
        if (url) {
            navigator.clipboard.writeText(url);
            alert("El enlace al calendario ha sido copiado al portapapeles.");
        } else {
            alert("Hubo un error al copiar el enlace.");
        }
    };

    return (
        <div className="p-4 bg-base-200 rounded-lg relative">
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
            <div ref={calendarRef}>
                <CalendarGrid
                    currentDate={currentDate}
                    events={events}
                    onDateClick={handleDateClick}
                    onEditEvent={(event) => {
                        setEditEvent({
                            ...event,
                            nombreCliente: event.nombreCliente || "Nombre no disponible",
                        });
                        setShowEditModal(true);
                    }}
                />
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
                        <button className="flex items-center mb-2 w-full" onClick={() => handleCopyLink()}>
                            <FaLink className="mr-2 text-blue-500" /> Copiar Enlace
                        </button>
                    </div>
                )}
            </div>
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