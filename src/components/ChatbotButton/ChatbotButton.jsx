import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import Chatbot from '../Chatbot/Chatbot';
import './ChatbotButton.css';

const ChatbotButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className="chatbot-button">
                <button 
                    className="toggle-button"
                    onClick={toggleChat}
                >
                    {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
                </button>
            </div>

            {isOpen && (
                <div className="chatbot-modal">
                    <div className="chatbot-content">
                        <Chatbot />
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatbotButton; 