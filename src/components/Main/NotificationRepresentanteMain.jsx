import React, { useState } from "react";
import { sendNotification } from "../../services/NotificationService";
import "./NotificationRepresentanteMain.css"; // Importar los estilos

const NotificationRepresentanteMain = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        setResponse("");
        setError("");

        try {
            const result = await sendNotification(email, message); // Llamar al servicio
            setResponse(result); // Mostrar el mensaje de éxito
        } catch (err) {
            setError(err); // Mostrar el mensaje de error
        }
    };

    return (
        <div className="notification-container">
            <h1>Notificar a Representante</h1>
            <form onSubmit={handleSubmit} className="notification-form">
                <div className="form-group">
                    <label htmlFor="email">Correo Electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Ingrese el correo del representante"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Mensaje:</label>
                    <textarea
                        id="message"
                        placeholder="Escriba su mensaje aquí"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn-submit">Enviar Notificación</button>
            </form>
            {response && <p className="success-message">{response}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};
export default NotificationRepresentanteMain;
