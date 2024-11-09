import React, { useState, useEffect } from "react";
import { FiPaperclip, FiSearch, FiCheck, FiX, FiEdit2, FiTrash2, FiMail } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const NotificationPanel = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            recipient: "john.doe@example.com",
            subject: "Actualización del Proyecto",
            message: "Buenos días, adjunto encontrará el informe actualizado del proyecto.",
            date: "2024-01-20",
            status: "delivered",
            attachments: ["informe.pdf"]
        },
        {
            id: 2,
            recipient: "maria.garcia@example.com",
            subject: "Reunión Semanal",
            message: "Recordatorio: Tenemos reunión mañana a las 10:00 AM.",
            date: "2024-01-19",
            status: "pending",
            attachments: []
        }
    ]);

    const [newNotification, setNewNotification] = useState({
        recipient: "",
        subject: "",
        message: "",
        attachments: []
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    const templates = [
        { id: 1, name: "Plantilla Reunión", content: "Estimado/a [nombre],\n\nLe recordamos la reunión programada para [fecha] a las [hora]." },
        { id: 2, name: "Plantilla Informe", content: "Adjunto el informe solicitado para su revisión." }
    ];

    const handleTemplateChange = (e) => {
        const template = templates.find(t => t.id === parseInt(e.target.value));
        if (template) {
            setSelectedTemplate(template.id);
            setNewNotification(prev => ({ ...prev, message: template.content }));
        }
    };

    const handleFileAttachment = (e) => {
        const files = Array.from(e.target.files);
        setNewNotification(prev => ({
            ...prev,
            attachments: [...prev.attachments, ...files.map(f => f.name)]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const notification = {
            ...newNotification,
            id: notifications.length + 1,
            date: new Date().toISOString().split("T")[0],
            status: "pending"
        };
        setNotifications([notification, ...notifications]);
        setNewNotification({ recipient: "", subject: "", message: "", attachments: [] });
        setSelectedTemplate("");
        setShowModal(true);
    };

    const filteredNotifications = notifications.filter(notification =>
        notification.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                    {/* Formulario de Composición */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-theme-color-neutral">Nueva Notificación</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="recipient" className="block text-sm font-medium text-theme-color-neutral">
                                    Destinatario
                                </label>
                                <input
                                    type="email"
                                    id="recipient"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-theme-color-primary focus:ring focus:ring-theme-color-primary focus:ring-opacity-50 p-2"
                                    value={newNotification.recipient}
                                    onChange={(e) => setNewNotification(prev => ({ ...prev, recipient: e.target.value }))}
                                />
                            </div>

                            <div>
                                <label htmlFor="template" className="block text-sm font-medium text-theme-color-neutral">
                                    Plantilla
                                </label>
                                <select
                                    id="template"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-theme-color-primary focus:ring focus:ring-theme-color-primary focus:ring-opacity-50 p-2"
                                    value={selectedTemplate}
                                    onChange={handleTemplateChange}
                                >
                                    <option value="">Seleccionar plantilla</option>
                                    {templates.map(template => (
                                        <option key={template.id} value={template.id}>{template.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-theme-color-neutral">
                                    Asunto
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-theme-color-primary focus:ring focus:ring-theme-color-primary focus:ring-opacity-50 p-2"
                                    value={newNotification.subject}
                                    onChange={(e) => setNewNotification(prev => ({ ...prev, subject: e.target.value }))}
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-theme-color-neutral">
                                    Mensaje
                                </label>
                                <textarea
                                    id="message"
                                    rows="4"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-theme-color-primary focus:ring focus:ring-theme-color-primary focus:ring-opacity-50"
                                    value={newNotification.message}
                                    onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-theme-color-neutral">
                                    Adjuntos
                                </label>
                                <div className="mt-1 flex items-center">
                                    <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                        <FiPaperclip className="mr-2" />
                                        Adjuntar archivo
                                        <input type="file" className="hidden" multiple onChange={handleFileAttachment} />
                                    </label>
                                    {newNotification.attachments.length > 0 && (
                                        <span className="ml-3 text-sm text-gray-500">
                      {newNotification.attachments.length} archivo(s) seleccionado(s)
                    </span>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-theme-color-primary hover:bg-theme-color-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-color-primary"
                            >
                                Enviar Notificación
                            </button>
                        </form>
                    </div>

                    {/* Vista Previa y Lista de Notificaciones */}
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-medium text-theme-color-neutral mb-4">Vista Previa</h3>
                            <div className="bg-white p-4 rounded-md border border-gray-200">
                                <p className="text-sm text-gray-600">Para: {newNotification.recipient}</p>
                                <p className="text-sm font-medium mt-2">{newNotification.subject}</p>
                                <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{newNotification.message}</p>
                                {newNotification.attachments.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-500">Adjuntos:</p>
                                        <ul className="mt-1 space-y-1">
                                            {newNotification.attachments.map((file, index) => (
                                                <li key={index} className="text-sm text-theme-color-primary">{file}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-theme-color-neutral">Notificaciones Enviadas</h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-color-primary"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 pr-2">
                                {filteredNotifications.map((notification) => (
                                    <motion.div
                                        key={notification.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium text-theme-color-neutral">{notification.subject}</p>
                                                <p className="text-sm text-gray-600 mt-1">{notification.recipient}</p>
                                                <div className="flex items-center mt-2 space-x-4">
                                                    <span className="text-sm text-gray-500">{notification.date}</span>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${notification.status === "delivered" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                            {notification.status === "delivered" ? (
                                <>
                                    <FiCheck className="mr-1" />
                                    Entregado
                                </>
                            ) : (
                                "Pendiente"
                            )}
                          </span>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => setSelectedNotification(notification)}
                                                    className="p-2 text-gray-500 hover:text-theme-color-primary"
                                                    aria-label="Ver detalles"
                                                >
                                                    <FiEdit2 />
                                                </button>
                                                <button
                                                    onClick={() => setNotifications(notifications.filter(n => n.id !== notification.id))}
                                                    className="p-2 text-gray-500 hover:text-red-500"
                                                    aria-label="Eliminar notificación"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Confirmación */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
                        >
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto">
                                <FiMail className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-medium text-center mt-4">Notificación Enviada</h3>
                            <p className="text-sm text-gray-500 text-center mt-2">Su notificación ha sido enviada correctamente.</p>
                            <button
                                onClick={() => setShowModal(false)}
                                className="mt-6 w-full inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-theme-color-primary hover:bg-theme-color-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-color-primary"
                            >
                                Aceptar
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationPanel;