// client/src/App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); // Adjust the URL if needed

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessage(msg);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    socket.emit('message', 'Hello from React!');
  };

  return (
    <div>
      <h1>Socket.IO React Example</h1>
      <p>Received Message: {message}</p>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}

export default App;

