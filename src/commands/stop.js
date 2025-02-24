module.exports = {
    name: 'stop',
    description: 'Stop playback and clear queue',
    execute(message) {
        const queue = queues.get(message.guildId);
        if (queue) {
            queue.stop();
            queues.delete(message.guildId);
            message.reply('Stopped playback and cleared queue!');
        } else {
            message.reply('No music is currently playing!');
        }
    }
};
