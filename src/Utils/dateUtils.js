import { format, isBefore, isSameDay } from "date-fns";

/**
 * Obtiene la clase CSS según el estado del evento.
 */
export const getColorClass = (estado) => {
    switch (estado) {
        case "INASISTENCIA":
            return "bg-red-200 text-red-800";
        case "ASISTENCIA":
            return "bg-green-200 text-green-800";
        default:
            return "bg-blue-200 text-blue-800";
    }
};

/**
 * Verifica si una fecha es anterior al día actual.
 */
export const isPastDate = (date) => {
    const today = new Date();
    return isBefore(date, today.setHours(0, 0, 0, 0));
};

/**
 * Formatea una fecha al formato deseado.
 */
export const formatDate = (date, formatString) => {
    return format(date, formatString);
};

/**
 * Verifica si dos fechas son el mismo día.
 */
export const areSameDay = (date1, date2) => {
    return isSameDay(date1, date2);
};