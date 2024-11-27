'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from "../../config/apiConfig";
import styles from './Chatbot.css';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Efecto para desplazarse al último mensaje automáticamente
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatProductResponse = (data) => {
        if (!Array.isArray(data)) return "No se encontraron fórmulas asociadas.";

        return data.map((formula) => {
            return `
            <div class="${styles.formattedResponse} border border-gray-200 bg-gray-50 p-3 rounded-lg mb-3">
                <p><strong>Nombre:</strong> ${formula.nombre}</p>
                <p><strong>Beneficios:</strong> ${formula.beneficios}</p>
                <p><strong>Ingredientes Clave:</strong> ${formula.ingredientesClave}</p>
                <p><strong>Diferencias:</strong> ${formula.diferencias}</p>
                <p><strong>Fecha de Desarrollo:</strong> ${new Date(formula.fechaDesarrollo).toLocaleDateString()}</p>
            </div>
        `;
        }).join("");
    };

    const addMessage = (text, isUser = false) => {
        setMessages((prevMessages) => [...prevMessages, { text, isUser }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!input.trim()) {
            addMessage('Por favor, escribe algo válido.', false);
            return;
        }

        // Añadir mensaje del usuario
        addMessage(input, true);
        setInput('');
        setIsLoading(true);

        try {
            if (input.toLowerCase().includes('consultar producto')) {
                await handleProductQuery(input);
            } else if (input.toLowerCase().includes('comparar fórmulas')) {
                await handleFormulaComparison(input);
            } else {
                handleLocalQueries(input);
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage('Ocurrió un error al procesar tu solicitud.', false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProductQuery = async (query) => {
        const productId = extractProductId(query);

        if (!productId) {
            addMessage('Por favor, proporciona un ID de producto válido.', false);
            return;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/chatbot/consultaPorProducto`, {
                params: { productoId: productId },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });

            const data = response.data;
            // Formatear la respuesta
            const formattedResponse = formatProductResponse(data);

            addMessage(`Fórmulas encontradas para el producto ${productId}: ${formattedResponse}`, false);
        } catch (error) {
            console.error('Error:', error);
            addMessage('Error al consultar el producto.', false);
        }
    };

    const handleFormulaComparison = async (query) => {
        const { idNueva, idAnterior } = extractFormulaIds(query);

        if (!idNueva || !idAnterior) {
            addMessage('Por favor, proporciona IDs válidos para ambas fórmulas.', false);
            return;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/chatbot/comparar`, {
                params: { idNueva, idAnterior },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });

            const data = response.data;
            addMessage(data, false);
        } catch (error) {
            console.error('Error:', error);
            addMessage('Error al comparar las fórmulas.', false);
        }
    };

    const handleLocalQueries = (query) => {
        const lowercaseQuery = query.toLowerCase();
        if (lowercaseQuery.includes('hola') || lowercaseQuery.includes('saludos')) {
            addMessage('¡Hola! ¿En qué puedo ayudarte hoy?', false);
        } else if (lowercaseQuery.includes('ayuda') || lowercaseQuery.includes('qué puedes hacer')) {
            addMessage('Puedo ayudarte con consultas de productos, comparación de fórmulas y responder preguntas frecuentes. Por ejemplo, puedes preguntarme "Consultar producto 123" o "Comparar fórmulas 456 y 789".', false);
        } else if (lowercaseQuery.includes('gracias')) {
            addMessage('¡De nada! Estoy aquí para ayudarte. ¿Hay algo más en lo que pueda asistirte?', false);
        } else if (lowercaseQuery.includes('cómo funciona')) {
            addMessage('Para consultar un producto, escribe "Consultar producto" seguido del ID del producto. Para comparar fórmulas, escribe "Comparar fórmulas" seguido de los dos IDs de las fórmulas que quieres comparar.', false);
        } else if (lowercaseQuery.includes('contacto') || lowercaseQuery.includes('soporte')) {
            addMessage('Para contactar con soporte, por favor envía un correo a megalabs@gmail.com o llama al +51 942 485 671 en horario de oficina.', false);
        } else {
            addMessage('Lo siento, no entiendo esa consulta. Puedes preguntarme sobre consultar productos, comparar fórmulas o hacer preguntas generales sobre el sistema.', false);
        }
    };

    const extractProductId = (query) => {
        const match = query.match(/\d+/);
        return match ? parseInt(match[0], 10) : null;
    };

    const extractFormulaIds = (query) => {
        const matches = query.match(/\d+/g);
        return {
            idNueva: matches?.[0] ? parseInt(matches[0], 10) : null,
            idAnterior: matches?.[1] ? parseInt(matches[1], 10) : null,
        };
    };

    return (
        <div className="card w-full max-w-2xl mx-auto bg-base-100 shadow-xl">
            <div className="card-body">
                <div className="space-y-4 h-96 overflow-y-auto mb-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`chat ${message.isUser ? 'chat-end' : 'chat-start'}`}
                        >
                            <div
                                className={`chat-bubble ${
                                    message.isUser ? 'chat-bubble-primary' : 'chat-bubble-secondary'
                                }`}
                            >
                                {/* Verificar si el texto contiene HTML formateado */}
                                {message.text.includes("<div") ? (
                                    <div dangerouslySetInnerHTML={{__html: message.text}}/>
                                ) : (
                                    message.text
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef}/>
                </div>
                <form onSubmit={handleSubmit} className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Escribe tu mensaje..."
                        className="input input-bordered flex-grow"
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;