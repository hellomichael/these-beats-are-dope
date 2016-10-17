/***********************************
Imports
***********************************/
import Playlist from './Playlist.js'
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
  let promises = []

  // Fetch album data
  json.albums.map(album => {
    let promise = fetch(`https://api.spotify.com/v1/tracks/${album.spotifyID}`)
    .then(response => response.json())
    .then(data => {
      data.youtubeID = album.youtubeID
      albums.push(new Album(data))
    })

    promises.push(promise)
  })

  // Create playlist
  Promise.all(promises).then(data => {
    let playlist = new Playlist({app: options.app, albums})
  })
})
