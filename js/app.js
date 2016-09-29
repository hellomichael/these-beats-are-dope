/***********************************
Imports
***********************************/
import Album from './Album.js';
require('../scss/app.scss')

/***********************************
App Settings
***********************************/
let options = {
  app:                    '#app',
  data:                   './json/playlist.json',
  spotify: {
    id:                   '6db74688ff0349308c85371275ab285a',
    secret:               '0988cd08186746218c146fe49c0d2042',
    api:                  'https://api.spotify.com/v1/'
  },
  youtube: {
    api:                  'https://www.youtube.com/player_api'
  }
}

let state = {
  loggedIn:               false,
  playlist:               []
}

/***********************************
Model - Fetch
***********************************/
fetch (options.data)
.then(response => response.json())
.then(playlist => {
  playlist.albums.map((album) => {
    state.playlist.push(
      new Album({
        spotifyID:          album.spotifyID,
        youtubeID:          album.youtubeID
      })
    )
  })
})

/***********************************
Controller - Events
***********************************/

/***********************************
Views - Render
***********************************/
function render (state, element) {
  element.innerHTML = ``
}

let app = document.querySelector(options.app)
render(state, app)
