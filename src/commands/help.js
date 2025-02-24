module.exports = {
    name: 'help',
    description: 'Show available commands',
    execute(message) {
        const helpText = `
Available commands:
!play <YouTube/Spotify URL> - Play a track
!skip - Skip current track
!stop - Stop playback and clear queue
!queue - Show current queue
!help - Show this help message
        `.trim();
        message.reply(helpText);
    }
};
