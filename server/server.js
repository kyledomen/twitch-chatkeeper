require('dotenv').config({path:'../.env'});
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const initializeSocket = require('./socket');
const {listenForMessages} = require('./twitch');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);

// CORS middleware
app.use(cors({
    origin: 'http://localhost:3000',     // The frontend React app
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

        Message.deleteMany({})
            .then(() => {
                console.log('Message collection cleared. Restarting database...');
            })
            .catch(err => console.log('Error cleaning messages: ', err));
    })
    .catch(err => console.error(err));


const io = initializeSocket(server);

listenForMessages(io);

// Start server on PORT 4000
const PORT = process.env.PORT || 4000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`server running on port ${PORT}`);
});
