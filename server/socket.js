const socketIo = require('socket.io');

const initializeSocket = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: ['http://localhost:3000', 'http://192.168.86.35:3000'],
            methods: ['GET', 'POST'],
        }
    });

    io.on('connection', (socket) => {
        console.log('user connected');

        socket.on('message', (msg) => {
            io.emit('message', msg);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });

    return io;
};

module.exports = initializeSocket;
