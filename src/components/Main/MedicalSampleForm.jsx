import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";

const MedicalSampleForm = () => {
    const [formData, setFormData] = useState({
        sampleNumber: "",
        receiverName: "",
        deliveryDate: new Date(),
        comments: ""
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!/^\d+$/.test(formData.sampleNumber)) {
            newErrors.sampleNumber = "El número de muestra debe contener solo dígitos.";
        }

        if (formData.receiverName.length < 3 || formData.receiverName.length > 50) {
            newErrors.receiverName = "El nombre del receptor debe tener entre 3 y 50 caracteres.";
        }

        const today = new Date();
        if (formData.deliveryDate < today) {
            newErrors.deliveryDate = "La fecha de entrega debe ser en el futuro.";
        }

        if (formData.comments.length > 500) {
            newErrors.comments = "Los comentarios no pueden exceder los 500 caracteres.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);

            try {
                await new Promise(resolve => setTimeout(resolve, 2000));
                toast.success("¡Formulario enviado con éxito!");
                setFormData({
                    sampleNumber: "",
                    receiverName: "",
                    deliveryDate: new Date(),
                    expiryDate: "",
                    batchNumber: "",
                    quantity: 0,
                    comments: "",
                    productId: ""
                });
            } catch (error) {
                toast.error("No se pudo enviar el formulario. Intenta nuevamente.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateExpiryDate = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        
        // No permitir fechas de caducidad pasadas
        if (expiry < today) {
            return "La fecha de caducidad no puede ser anterior a hoy";
        }
        
        // Alertar sobre muestras próximas a caducar (3 meses)
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
        
        if (expiry <= threeMonthsFromNow) {
            return "¡Advertencia! Esta muestra caducará en los próximos 3 meses";
        }
        
        return null;
    };

    const ExpiryAlert = ({ message }) => {
        return (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                <div className="flex items-center">
                    <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    <span>{message}</span>
                </div>
            </div>
        );
    };

    const updateInventory = async (productId, quantity) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/inventory/update`, {
                productId,
                quantity,
                action: 'ADD'
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 200) {
                toast.success("Inventario actualizado correctamente");
            }
        } catch (error) {
            console.error("Error al actualizar el inventario:", error);
            toast.error("Error al actualizar el inventario");
            throw error;
        }
    };

    const generateReport = async (startDate, endDate) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/samples/report`, {
                params: {
                    startDate,
                    endDate
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            return response.data;
        } catch (error) {
            console.error("Error al generar el informe:", error);
            toast.error("Error al generar el informe de recepción");
            throw error;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-600 p-4 sm:p-6 md:p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-6">
                <h1 className="text-3xl font-bold text-green-600 mb-8 text-center">
                    Formulario de Recepción de Muestras Médicas
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label
                            htmlFor="sampleNumber"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Número de Muestra *
                        </label>
                        <input
                            type="text"
                            id="sampleNumber"
                            name="sampleNumber"
                            value={formData.sampleNumber}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none ${errors.sampleNumber ? "border-red-500" : "border-gray-300"}`}
                            aria-invalid={!!errors.sampleNumber}
                            aria-describedby="sampleNumber-error"
                        />
                        {errors.sampleNumber && (
                            <p id="sampleNumber-error" className="text-red-500 text-sm mt-1">
                                {errors.sampleNumber}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="receiverName"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Nombre del Receptor *
                        </label>
                        <input
                            type="text"
                            id="receiverName"
                            name="receiverName"
                            value={formData.receiverName}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none ${errors.receiverName ? "border-red-500" : "border-gray-300"}`}
                            aria-invalid={!!errors.receiverName}
                            aria-describedby="receiverName-error"
                        />
                        {errors.receiverName && (
                            <p id="receiverName-error" className="text-red-500 text-sm mt-1">
                                {errors.receiverName}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="deliveryDate"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Fecha de Entrega *
                        </label>
                        <DatePicker
                            selected={formData.deliveryDate}
                            onChange={(date) => setFormData(prev => ({ ...prev, deliveryDate: date }))}
                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none ${errors.deliveryDate ? "border-red-500" : "border-gray-300"}`}
                            minDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            aria-invalid={!!errors.deliveryDate}
                            aria-describedby="deliveryDate-error"
                        />
                        {errors.deliveryDate && (
                            <p id="deliveryDate-error" className="text-red-500 text-sm mt-1">
                                {errors.deliveryDate}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="comments"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Comentarios Adicionales
                        </label>
                        <textarea
                            id="comments"
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Ingrese notas o comentarios adicionales aquí..."
                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none ${errors.comments ? "border-red-500" : "border-gray-300"}`}
                            aria-invalid={!!errors.comments}
                            aria-describedby="comments-error"
                        />
                        {errors.comments && (
                            <p id="comments-error" className="text-red-500 text-sm mt-1">
                                {errors.comments}
                            </p>
                        )}
                        <p className="text-sm text-gray-500">
                            Quedan {500 - formData.comments.length} caracteres.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-6 text-white bg-green-600 hover:bg-green-700 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Enviar formulario"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Procesando...
              </span>
                        ) : (
                            "Enviar Recepción de Muestra"
                        )}
                    </button>
                </form>
            </div>
            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default MedicalSampleForm;