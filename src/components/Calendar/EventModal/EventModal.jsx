import React from "react";
import { Autocomplete, TextField } from '@mui/material';
import { FaTimes } from "react-icons/fa";

const EventModal = ({ 
    onClose, 
    onSubmit, 
    motivos = [], // Valor por defecto
    eventDetails, 
    setEventDetails, 
    title, 
    mode,
    clientes = [], // Valor por defecto para el array de clientes
    selectedCliente = null, // Valor por defecto para el cliente seleccionado
    onClienteChange 
}) => {
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
                    {/* Autocompletado de Cliente */}
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Nombre del Cliente</span>
                        </label>
                        <Autocomplete
                            options={clientes}
                            value={selectedCliente}
                            onChange={(event, newValue) => {
                                if (onClienteChange) onClienteChange(newValue);
                            }}
                            getOptionLabel={(option) => option?.label || ''}
                            isOptionEqualToValue={(option, value) => 
                                option?.value === value?.value
                            }
                            disabled={mode === "edit"}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder="Buscar cliente..."
                                    fullWidth
                                    required
                                    size="small"
                                />
                            )}
                            noOptionsText="No se encontraron clientes"
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
                                setEventDetails({ ...eventDetails, fechaHora: `${fechaBase}T${e.target.value}:00` });
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