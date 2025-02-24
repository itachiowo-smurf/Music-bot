// src/index.js
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config/config');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ]
});

// Command handler setup
client.commands = new Map();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands'))
    .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Event handler setup
const eventFiles = fs.readdirSync(path.join(__dirname, 'events'))
    .filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(config.token);

// src/commands/play.js
const { joinVoiceChannel } = require('@discordjs/voice');
const { handleYouTubeURL } = require('../utils/YouTubeHandler');
const { handleSpotifyURL } = require('../utils/SpotifyHandler');
const MusicQueue = require('../utils/MusicQueue');
const queues = new Map();

module.exports = {
    name: 'play',
    description: 'Play a song from YouTube or Spotify',
    async execute(message, args) {
        if (!message.member.voice.channel) {
            return message.reply('You need to be in a voice channel!');
        }

        const url = args[0];
        if (!url) {
            return message.reply('Please provide a YouTube or Spotify URL!');
        }

        let queue = queues.get(message.guildId);
        if (!queue) {
            queue = new MusicQueue();
            queues.set(message.guildId, queue);
        }

        try {
            if (!queue.connection) {
                queue.connection = joinVoiceChannel({
                    channelId: message.member.voice.channel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                });
                queue.connection.subscribe(queue.player);
            }

            let track;
            if (url.includes('spotify.com')) {
                track = await handleSpotifyURL(url);
            } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
                track = await handleYouTubeURL(url);
            } else {
                return message.reply('Invalid URL! Please provide a YouTube or Spotify link.');
            }

            queue.addTrack(track);
            message.reply(`Added to queue: ${track.title}`);

            if (!queue.playing) {
                queue.playNext();
            }
        } catch (err) {
            console.error('Error adding track:', err);
            message.reply('Error adding track to queue!');
        }
    }
};
