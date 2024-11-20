import React, { useMemo } from "react";
import { startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import DayCell from "./DayCell";

const CalendarGrid = ({ currentDate, events, onDateClick, onEditEvent }) => {
    const daysInMonth = useMemo(() => {
        return eachDayOfInterval({
            start: startOfMonth(currentDate),
            end: endOfMonth(currentDate),
        });
    }, [currentDate]);

    const firstDayOfMonth = daysInMonth[0].getDay();
    const blanks = Array(firstDayOfMonth).fill(null);

    return (
        <div className="grid grid-cols-7 gap-2">
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                <div key={day} className="text-center font-bold uppercase">
                    {day}
                </div>
            ))}
            {[...blanks, ...daysInMonth].map((day, index) => (
                <DayCell
                    key={index}
                    day={day}
                    events={events.filter((event) => day && isSameDay(new Date(event.fechaHora), day))}
                    onDateClick={onDateClick}
                    onEditEvent={onEditEvent}
                />
            ))}
        </div>
    );
};

export default CalendarGrid;