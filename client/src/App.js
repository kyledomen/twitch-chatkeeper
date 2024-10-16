// client/src/App.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './App.css';

const socket = io('http://localhost:4000');

const ChatComponent = () => {
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const chatBoxRef = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

    // Memoize the scrollToBottom function to prevent re-definition on every render
    const scrollToBottom = useCallback(() => {
        if (isAtBottom) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isAtBottom]);

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

    // Handle scroll behavior
    const handleScroll = () => {
        const chatBox = chatBoxRef.current;
    
        if (!chatBox) return;
    
        const atBottom = chatBox.scrollHeight - chatBox.clientHeight <= chatBox.scrollTop + 1;
        setIsAtBottom(atBottom);
    };

    // Auto-scroll when new messages are received, but only if the user is at the bottom
    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]); // Add scrollToBottom in the dependency array

    return (
        <div className="chat-container">
            <div className="chat-box" ref={chatBoxRef} onScroll={handleScroll}>
                <ul className="message-list">
                    {messages.map((data, index) => (
                        <li key={index}>
                            <strong style={{ color: data.color }}>{data.username}:</strong>
                            <span style={{ marginLeft: '5px' }}>{data.message}</span>
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
