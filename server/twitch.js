require('dotenv').config();

const tmi = require('tmi.js');

const twitchOpts = {
    identity: {
        username: process.env.TWITCH_USERNAME,
        password: process.env.TWITCH_OAUTH_TOKEN
    },
    channels: [
        'mang0'
    ]
};

const twitchClient = new tmi.Client(twitchOpts);
twitchClient.connect();

const listenForMessages = (io) => {
    twitchClient.on('message', (channel, tags, message, self) => {
        if (self) return;
        const chatMessage = `${tags['display-name']}: ${message}`;
        console.log(chatMessage);
        console.log(channel);
        console.log(tags);
        console.log(message);
        io.emit('twitchMessage', chatMessage);
    });
};

module.exports = {
    twitchClient,
    listenForMessages
};
