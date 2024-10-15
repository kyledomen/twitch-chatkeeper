// client/src/App.js
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './App.css';

const socket = io('http://localhost:4000'); // Connect to your Socket.IO server

const ChatComponent = () => {
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const chatBoxRef = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

    useEffect(() => {
        socket.on('channelName', (name) => {
            const channelNameElement = document.getElementById('channel-name');
            channelNameElement.innerText = `${name}'s chat`;
        });

        axios.get('http://localhost:4000/api/messages')
            .then(response => {
                setMessages(response.data);
            })
            .catch(error => console.error('Error fetching messages; ', error));

        socket.on('twitchMessage', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            socket.off('channelName');
            socket.off('twitchMessage');
        };
    }, []);

    const scrollToBottom = () => {
        if (isAtBottom) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    const handleScroll = () => {
        const chatBox = chatBoxRef.current;
    
        if (!chatBox) return;
    
        const atBottom = chatBox.scrollHeight - chatBox.clientHeight <= chatBox.scrollTop + 1;
        
        setIsAtBottom(atBottom);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    return (
        <div className="chat-container">
            <div className="chat-box" ref={chatBoxRef} onScroll={handleScroll}>
                <ul className="message-list">
                    {messages.map((message, index) => (
                        <li key={index}>
                            <strong>{message.username}:</strong> {message.message}
                        </li>
                    ))}
                    {/* Ref element to ensure auto-scroll to bottom */}
                    <div ref={messagesEndRef} />
                </ul>
            </div>
        </div>
    );
};

export default ChatComponent;
