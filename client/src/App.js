// client/src/App.js
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:4000'); // Connect to your Socket.IO server

const ChatComponent = () => {
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        socket.on('twitchMessage', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            socket.off('twitchMessage');
        };
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="chat-container">
            <h1>Chat History</h1>
            <div className="chat-box">
                <ul className="message-list">
                    {messages.map((message, index) => (
                        <li key={index}>{message}</li>
                    ))}
                    {/* Ref element to ensure auto-scroll to bottom */}
                    <div ref={messagesEndRef} />
                </ul>
            </div>
        </div>
    );
};

export default ChatComponent;
