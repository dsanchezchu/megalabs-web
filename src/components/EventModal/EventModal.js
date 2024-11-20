import React from "react";
import { FaTimes } from "react-icons/fa";

const EventModal = ({ onClose, onSubmit, motivos, eventDetails, setEventDetails, title, mode }) => {
    const isReadOnly = mode === "edit" && eventDetails.estado === "INASISTENCIA";

    return (
        <div className="modal modal-open">
            <div className="modal-box relative">
                <h3 className="text-lg font-bold">{title}</h3>
                <button
                    className="absolute top-2 right-2 btn btn-sm btn-circle btn-error"
                    onClick={onClose}
                >
                    <FaTimes />
                </button>
                <form onSubmit={onSubmit}>
                    {/* Nombre del Cliente */}
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Nombre del Cliente</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered"
                            value={eventDetails.nombreCliente}
                            onChange={(e) => setEventDetails({ ...eventDetails, nombreCliente: e.target.value })}
                            required
                            disabled={isReadOnly && mode === "edit"} // Editable solo si no es INASISTENCIA
                        />
                    </div>

                    {/* Motivo */}
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

                    {/* Hora */}
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

                    {/* Estado */}
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Estado</span>
                        </label>
                        <select
                            className="select select-bordered"
                            value={eventDetails.estado}
                            onChange={(e) => setEventDetails({ ...eventDetails, estado: e.target.value })}
                            disabled={isReadOnly && mode === "edit"} // Editable si no es INASISTENCIA
                            required
                        >
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="ASISTENCIA">Asistencia</option>
                            <option value="INASISTENCIA">Inasistencia</option>
                        </select>
                    </div>

                    {/* Botones */}
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