import React from "react";
import { FaTimes } from "react-icons/fa";

const EventModal = ({ onClose, onSubmit, motivos, eventDetails, setEventDetails, title, mode }) => {
    const isReadOnly = mode === "edit" && eventDetails.estado === "INASISTENCIA";

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="text-lg font-bold">{title}</h3>
                <button
                    className="absolute top-2 right-2 btn btn-sm btn-circle btn-error"
                    onClick={onClose}
                >
                    <FaTimes />
                </button>
                <form onSubmit={onSubmit}>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Motivo</span>
                        </label>
                        <select
                            className="select select-bordered"
                            value={eventDetails.motivo}
                            onChange={(e) => setEventDetails({ ...eventDetails, motivo: e.target.value })}
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
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Hora</span>
                        </label>
                        <input
                            type="time"
                            className="input input-bordered"
                            value={eventDetails.fechaHora.split("T")[1]?.substring(0, 5)}
                            onChange={(e) => {
                                const fechaBase = eventDetails.fechaHora.split("T")[0];
                                const nuevaHora = e.target.value;
                                setEventDetails({ ...eventDetails, fechaHora: `${fechaBase}T${nuevaHora}:00` });
                            }}
                            disabled={isReadOnly}
                            required
                        />
                    </div>
                    <div className="modal-action">
                        <button className="btn btn-primary" type="submit">
                            Guardar
                        </button>
                        <button className="btn" type="button" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventModal;