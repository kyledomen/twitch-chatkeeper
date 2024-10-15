const tmi = require('tmi.js');
const Message = require('./models/Message');

const twitchOpts = {
    identity: {
        username: process.env.TWITCH_USERNAME,
        password: process.env.TWITCH_OAUTH_TOKEN
    },
    channels: [
        'SmallAnt'
    ]
};

const twitchClient = new tmi.Client(twitchOpts);

const sendChannelName = (io) => {
    const name = twitchOpts.channels[0];

    // the channel names have a '#' in front of it for some reason
    // emit the channel name without it
    io.emit('channelName', name.substring(1, name.length));
};

const listenForMessages = (io) => {
    twitchClient.on('connected', () => {
        console.log('Connected to Twitch!');

        // Emit the channel name after the Twitch client connects
        io.emit('channelName', twitchOpts.channels[0]);
    });

    twitchClient.on('message', (channel, tags, message, self) => {
        if (self) return;

        const chatMessage = `${tags['display-name']}: ${message}`;
        console.log(chatMessage);

        const newMessage = new Message({
            username: tags['display-name'],
            message: message
        });

        newMessage.save()
            .then(() => {
                console.log('Message saved to database.');
                console.log();
            })
            .catch(err => console.error(err));
        
        io.emit('twitchMessage', {
            username: tags['display-name'],
            message: message
        });
    });
};

const connectToTwitch = async (io) => {
    try {
        await twitchClient.connect();
    } catch (error) {
        console.error('Error connecting to Twitch:', error);
    }
};

const listenForConnections = (io) => {
    io.on('connection', (socket) => {
        console.log('A client connected');
        // Emit the channel name only when a client connects
        sendChannelName(io);
    });
};


module.exports = {
    listenForConnections,
    connectToTwitch,
    listenForMessages
};
