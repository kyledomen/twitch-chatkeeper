require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const initializeSocket = require('./socket');
const {listenForMessages} = require('./twitch');

const app = express();
const server = http.createServer(app);

// CORS middleware
app.use(cors({
    origin: 'http://localhost:3000',     // The frontend React app
}));

app.get('/', (req, res) => {
    res.send('hello from server');
});

/*
mongoose.connect('mongodb+srv://kdomen:<db_password>@chatcluster.jcnl5.mongodb.net/?retryWrites=true&w=majority&appName=ChatCluster', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

mongoose.connect('');
*/

const io = initializeSocket(server);

listenForMessages(io);

// Start server on PORT 4000
const PORT = process.env.PORT || 4000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`server running on port ${PORT}`);
});
