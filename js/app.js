/***********************************
Imports
***********************************/
import Album from './Album.js';
require('../scss/app.scss')

/***********************************
App Settings
***********************************/
let options = {
  app:                    document.querySelector('.playlist'),
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
  

  render(state, options.app)
})

/***********************************
Controller - Events
***********************************/

/***********************************
Views - Render
***********************************/
function renderAlbum () {
  return `
    <div class="album">
      <div class="album__video">

      </div>

      <div class="album__track">
        <div class="album__cd cd">
          <div class="cd__front"></div>
          <div class="cd__back"></div>
        </div>

        <h4 class="album__single">

        </h4>

        <h2 class="album__title">

        </h2>
      </div>
    </div>
  `
}

function renderPlaylist () {
  let playlist = state.playlist.map((album) => {
    return renderAlbum()
  }).join('')

  return `
    <div class="playlist__frame playlist__frame--top"></div>
    <div class="playlist__frame playlist__frame--right"></div>
    <div class="playlist__frame playlist__frame--bottom"></div>
    <div class="playlist__frame playlist__frame--left"></div>

    <div class="playlist__progress-bar"></div>
    <div class="playlist__control playlist__control--prev"></div>
    <div class="playlist__control playlist__control--next"></div>

    <div class="playlist__albums">
      ${playlist}
    </div>
  `
}

function render (state, element) {
  element.innerHTML = renderPlaylist()
}
