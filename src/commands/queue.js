module.exports = {
    name: 'queue',
    description: 'Show the current queue',
    execute(message) {
        const queue = queues.get(message.guildId);
        if (!queue || queue.queue.length === 0) {
            return message.reply('Queue is empty!');
        }

        const queueList = queue.queue
            .map((track, index) => `${index + 1}. ${track.title}`)
            .join('\n');
        message.reply(`Current queue:\n${queueList}`);
    }
};
