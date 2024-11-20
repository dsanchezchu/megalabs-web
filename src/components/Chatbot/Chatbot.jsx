'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, RefreshCw } from 'lucide-react';
import {API_BASE_URL} from "../../config/apiConfig";

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
                addMessage(
                    'Lo siento, no entiendo esa consulta. Puedes preguntarme sobre consultar productos o comparar fórmulas.',
                    false
                );
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
            addMessage(`Fórmulas encontradas para el producto ${productId}: ${JSON.stringify(data)}`, false);
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
                            className={`chat ${message.isUser ? 'chat-end' : 'chat-start'}`
                            }
                        >
                            <div
                                className={`chat-bubble ${
                                    message.isUser
                                        ? 'chat-bubble-primary'
                                        : 'chat-bubble-secondary'
                                }`}
                            >
                                {message.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
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