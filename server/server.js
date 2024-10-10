const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for both Express and Socket.IO
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000', // The frontend React app
        methods: ['GET', 'POST'],        // Allow these HTTP methods
    }
});

// CORS for Express server
app.use(cors({
    origin: 'http://localhost:3000',     // The frontend React app
}));

// Simple GET route for testing
app.get('/', (req, res) => {
    res.send('hello from server');
});

// Socket.IO events
io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('message', (msg) => {
        io.emit('message', msg);  // Broadcast message to all clients
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Start server on PORT 4000
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

