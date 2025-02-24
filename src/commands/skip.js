module.exports = {
    name: 'skip',
    description: 'Skip the current track',
    execute(message) {
        const queue = queues.get(message.guildId);
        if (queue && queue.playing) {
            queue.player.stop();
            message.reply('Skipped current track!');
        } else {
            message.reply('No track is currently playing!');
        }
    }
};
