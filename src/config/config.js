require('dotenv').config();

module.exports = {
    token: process.env.TOKEN,
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    prefix: '!'
};
