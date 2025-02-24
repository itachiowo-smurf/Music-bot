module.exports = {
    name: 'voiceStateUpdate',
    execute(oldState, newState) {
        // Handle bot disconnection or channel changes
        const queue = queues.get(oldState.guild.id);
        if (!queue) return;

        if (oldState.channel && !newState.channel) {
            // User left voice channel
            const members = oldState.channel.members.filter(member => !member.user.bot);
            if (members.size === 0) {
                // No users left in channel, disconnect bot
                queue.stop();
                queues.delete(oldState.guild.id);
            }
        }
    }
};
