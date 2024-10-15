const tmi = require('tmi.js');
const Message = require('./models/Message');

const twitchOpts = {
    identity: {
        username: process.env.TWITCH_USERNAME,
        password: process.env.TWITCH_OAUTH_TOKEN
    },
    channels: [
        'loltyler1'
    ]
};

const twitchClient = new tmi.Client(twitchOpts);
twitchClient.connect();

const listenForMessages = (io) => {
    twitchClient.on('message', (channel, tags, message, self) => {
        if (self) return;

        const chatMessage = `${tags['display-name']}: ${message}`;
        console.log(chatMessage);

        const newMessage = new Message({
            username: tags['display-name'],
            message: message
        });

        newMessage.save()
            .then(() => console.log('Message saved to database.'))
            .catch(err => console.error(err));
        
        io.emit('twitchMessage', {
            username: tags['display-name'],
            message: message
        });
    });
};

module.exports = {
    twitchClient,
    listenForMessages
};
