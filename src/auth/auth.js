const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
const RESPONSE_TYPE = 'token'
//space between each scope
const SPACE_DELIMITER = '%20'
const SCOPES = 'user-top-read%20streaming%20user-read-email%20user-read-private%20user-read-playback-state%20user-modify-playback-state%20playlist-read-private%20playlist-read-collaborative%20playlist-modify-private%20playlist-modify-public'
//const SCOPES = ['user-top-read','user-read-recently-played','user-read-privated','playlist-read-private']

//const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER)
module.exports = {
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
    AUTH_ENDPOINT,
    RESPONSE_TYPE,
    //SCOPES_URL_PARAM,
    SCOPES
}


