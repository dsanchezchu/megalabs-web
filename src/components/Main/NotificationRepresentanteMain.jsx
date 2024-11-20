import React, { useState } from "react";
import { sendNotification } from "../../services/NotificationService";
import ReactModal from "react-modal";
import { FaSpinner } from "react-icons/fa";
import "./NotificationRepresentanteMain.css";

const NotificationRepresentanteMain = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setModalContent("");

        try {
            const result = await sendNotification(email, message);
            setModalContent(`✅ Notificación enviada exitosamente a ${email}`);
        } catch (err) {
            setModalContent(`❌ Error al enviar la notificación: ${err.message || "Ocurrió un error"}`);
        } finally {
            setLoading(false);
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="notification-container">
            <h1 className="notification-title">Notificar a Representante</h1>
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
                <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? <FaSpinner className="spinner" /> : "Enviar Notificación"}
                </button>
            </form>

            {modalContent && (
                <ReactModal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    className="modal-content"
                    overlayClassName="modal-overlay"
                    ariaHideApp={false}
                >
                    <div className="modal-body">
                        <p>{modalContent}</p>
                        <button onClick={closeModal} className="btn-close">Aceptar</button>
                    </div>
                </ReactModal>
            )}
        </div>
    );
};

export default NotificationRepresentanteMain;
