'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from "../../config/apiConfig";
import styles from './Chatbot.css';

const normalizeText = (text) => {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const Chatbot = () => {
    const [messages, setMessages] = useState(() => {
        // Recuperar mensajes guardados del localStorage al iniciar
        const savedMessages = localStorage.getItem('chatMessages');
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [feedback, setFeedback] = useState({});
    const [error, setError] = useState(null);
    const [isTyping, setIsTyping] = useState(false);

    // Guardar mensajes en localStorage cada vez que cambian
    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

    // Agregar función para limpiar el historial
    const clearChat = () => {
        setMessages([]);
        localStorage.removeItem('chatMessages');
    };

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
        setError(null);

        if (!input.trim()) {
            setError('Por favor, escribe algo válido.');
            return;
        }

        const normalizedInput = normalizeText(input);
        addMessage(input, true);
        setInput('');
        setIsLoading(true);

        try {
            if (normalizedInput.includes('consultar producto')) {
                await handleProductQuery(input);
            } else if (normalizedInput.includes('comparar formulas')) {
                await handleFormulaComparison(input);
            } else {
                // Primero intentamos con respuestas locales
                const localResponse = getLocalResponse(normalizedInput);
                if (localResponse) {
                    addMessage(localResponse, false);
                } else {
                    // Si no hay respuesta local, consultamos a Hugging Face
                    const response = await axios.post(
                        'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
                        {
                            inputs: input,
                            parameters: {
                                max_length: 100,
                                temperature: 0.7,
                                top_p: 0.9,
                                return_full_text: false
                            }
                        },
                        {
                            headers: {
                                'Authorization': `Bearer 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`,
                                'Content-Type': 'application/json',
                            }
                        }
                    );

                    let botResponse = response.data[0]?.generated_text || 'Lo siento, no pude entender tu mensaje.';
                    
                    // Asegurarse de que la respuesta sea en español
                    if (!isSpanish(botResponse)) {
                        botResponse = 'Lo siento, no pude entender tu mensaje. ¿Podrías reformularlo?';
                    }
                    
                    addMessage(botResponse, false);
                }
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error al procesar tu solicitud');
            addMessage('Lo siento, ocurrió un error. Por favor, intenta de nuevo.', false);
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

    // Función auxiliar para verificar si el texto está en español
    const isSpanish = (text) => {
        const spanishPattern = /[áéíóúñ¿¡]/i;
        const spanishWords = ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'pero'];
        
        return spanishPattern.test(text) || 
               spanishWords.some(word => text.toLowerCase().includes(word));
    };

    // Función para obtener respuestas locales
    const getLocalResponse = (normalizedQuery) => {
        const responses = {
            'hola': '¡Hola! ¿En qué puedo ayudarte hoy?',
            'gracias': '¡De nada! Estoy aquí para ayudarte.',
            'adios': '¡Hasta luego! Que tengas un excelente día.',
            'ayuda': 'Puedo ayudarte con:\n- Consultas de productos\n- Comparación de fórmulas\n- Responder preguntas generales',
            'como estas': '¡Muy bien, gracias por preguntar! ¿En qué puedo ayudarte?'
        };

        for (const [key, value] of Object.entries(responses)) {
            if (normalizedQuery.includes(key)) {
                return value;
            }
        }
        return null;
    };

    const handleFeedback = (messageId, isHelpful) => {
        setFeedback(prev => ({
            ...prev,
            [messageId]: isHelpful
        }));
    };

    const suggestions = [
        "Consultar producto 123",
        "Comparar fórmulas 456 y 789",
        "Necesito ayuda"
    ];

    const simulateTyping = async (message) => {
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        addMessage(message, false);
        setIsTyping(false);
    };

    return (
        <div className="card w-full max-w-2xl mx-auto">
            <div className="card-body">
                <div className="flex justify-end mb-2">
                    <button 
                        onClick={clearChat}
                        className="text-sm px-3 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
                    >
                        Limpiar chat
                    </button>
                </div>
                
                <div className="chat-container">
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
                                {message.text.includes("<div") ? (
                                    <div dangerouslySetInnerHTML={{__html: message.text}}/>
                                ) : (
                                    message.text
                                )}
                                {!message.isUser && (
                                    <div className="feedback-buttons">
                                        <button onClick={() => handleFeedback(index, true)}>👍</button>
                                        <button onClick={() => handleFeedback(index, false)}>👎</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="chat chat-start">
                            <div className="chat-bubble chat-bubble-secondary">
                                <div className="typing-indicator">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef}/>
                </div>
                
                <div className="suggestions-container">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => setInput(suggestion)}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="input-container">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Escribe tu mensaje..."
                    />
                    <button
                        type="submit"
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