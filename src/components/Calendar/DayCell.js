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
                    <div className="mt-1 space-y-1">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className={`p-1 rounded-lg text-xs ${event.colorClass}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEditEvent(event);
                                }}
                            >
                                {event.motivo}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default DayCell;