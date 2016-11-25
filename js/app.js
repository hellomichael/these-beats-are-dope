/***********************************
Imports
***********************************/
import 'whatwg-fetch'
import Playlist from './Playlist.js'
import Album from './Album.js'
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
fetch(options.json)
.then(response => response.json())
.then(json => {
  let playlist = new Playlist({
    app: options.app,
    playlist: json.playlist
  })
})
