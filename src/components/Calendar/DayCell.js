import React from "react";
import { format } from "date-fns";

const DayCell = ({ day, events, onDateClick, onEditEvent }) => {
    return (
        <div
            className={`p-2 border rounded-lg bg-base-100 ${day ? "cursor-pointer" : "bg-base-200"}`}
            onClick={() => day && onDateClick(day)}
        >
            {day && (
                <>
                    <div className="font-bold">{format(day, "d")}</div>
                    {/* Contenedor de citas con scroll */}
                    <div className="mt-1 space-y-1 overflow-y-auto max-h-20">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className={`p-1 rounded-lg text-xs ${event.colorClass} truncate`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEditEvent(event);
                                }}
                                title={`${event.motivo} - ${event.nombreCliente || "Nombre no disponible"}`}
                            >
                                <strong>{event.motivo}</strong>
                                <br />
                                - {event.nombreCliente || "Nombre no disponible"}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default DayCell;