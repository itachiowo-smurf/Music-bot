const ytdl = require('ytdl-core');

class YouTubeHandler {
    async handleYouTubeURL(url) {
        const info = await ytdl.getInfo(url);
        return {
            title: info.videoDetails.title,
            youtubeUrl: url,
            platform: 'youtube'
        };
    }

    handleYouTubeStream(url) {
        return ytdl(url, { 
            filter: 'audioonly', 
            quality: 'highestaudio',
            highWaterMark: 1 << 25 // 32MB buffer
        });
    }
}

module.exports = new YouTubeHandler();
