/***********************************
Imports
***********************************/
import Playlist from './Playlist.js'
import YouTube from 'youtube-player'
import Album from './Album.js';
require('../scss/app.scss')

/***********************************
App Settings
***********************************/
let options = {
  app:                    document.querySelector('#app'),
  json:                   './json/playlist.json'
}

/***********************************
App Initialize
***********************************/
// Fetch playlist data
fetch(options.json)
.then(response => response.json())
.then(json => {
  let albums = []
  let videos = []
  let promises = []

  // Fetch album data
  json.albums.map((album) => {
    let promise = fetch(`https://api.spotify.com/v1/tracks/${album.spotifyID}`)
    .then(response => response.json())
    .then(data => {
      videos.push(new YouTube('player', {
        videoId: album.youtubeID,
        width: window.innerWidth,
        height: window.innerHeight + 600,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showInfo: 0,
          iv_load_policy: 3,
        }
      }))

      albums.push(new Album(data))
    })

    promises.push(promise)
  })

  Promise.all(promises).then(data => {
    // Create playlist
    let playlist = new Playlist({app: options.app, albums, videos})

    // Render playlist
    options.app.innerHTML = playlist.render()
  })
})
