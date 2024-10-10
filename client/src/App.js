// client/src/App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); // Adjust the URL if needed

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('twitchMessage', (msg) => {
      setMessage(msg);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  return (
    <div>
      <b>most recent chat:</b>
      <p>{message}</p>
    </div>
  );
}

export default App;
