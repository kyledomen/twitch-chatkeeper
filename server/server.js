require('dotenv').config({path:'../.env'});
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const initializeSocket = require('./socket');
const {listenForConnections, connectToTwitch, listenForMessages} = require('./twitch');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);

// CORS middleware to make socket.io work
const allowedOrigins = ['http://localhost:3000', 'http://192.168.86.35:3000'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

app.get('/', (req, res) => {
    res.send('hello from server');
});

app.get('/api/messages', async(req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

mongoose.connect(process.env.MONGODB_CONN_STRING)
    .then(() => {
        console.log('MongoDB connected');

        // Clear the database
        Message.deleteMany({})
        .then(() => {
            console.log('Message collection cleared. Restarting database...');
            console.log();
        })
        .catch(err => console.log('Error cleaning messages: ', err));

        const io = initializeSocket(server);
        listenForConnections(io);
        connectToTwitch(io);
        listenForMessages(io);
    })
    .catch(err => console.error(err));


// Start server on PORT 4000
const PORT = process.env.PORT || 4000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
