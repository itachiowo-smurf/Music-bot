const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { handleYouTubeStream } = require('./YouTubeHandler');

class MusicQueue {
    constructor() {
        this.queue = [];
        this.player = createAudioPlayer();
        this.playing = false;
        this.connection = null;

        this.player.on(AudioPlayerStatus.Idle, () => {
            this.playing = false;
            this.playNext();
        });
    }

    addTrack(track) {
        this.queue.push(track);
    }

    async playNext() {
        if (this.queue.length === 0) {
            this.playing = false;
            return;
        }

        const track = this.queue.shift();
        try {
            const stream = await handleYouTubeStream(track.youtubeUrl);
            const resource = createAudioResource(stream);
            this.player.play(resource);
            this.playing = true;
        } catch (err) {
            console.error('Error playing track:', err);
            this.playNext();
        }
    }

    stop() {
        this.queue = [];
        this.player.stop();
        if (this.connection) {
            this.connection.destroy();
            this.connection = null;
        }
        this.playing = false;
    }
}

module.exports = MusicQueue;
