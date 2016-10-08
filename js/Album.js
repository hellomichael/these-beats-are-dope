export default class Album {
  constructor(options) {
    //this.album = options.album,
    //this.song =  options.song,
    this.spotifyID = options.spotifyID,
    this.youtubeID = options.youtubeID

    this.getSpotifyData()
    .then(data => Object.assign(this, data))
    .then(console.log(this))
  }

  getSpotifyData() {
    return fetch(`https://api.spotify.com/v1/tracks/${this.spotifyID}`)
    .then(response => response.json())
    .then(data => data)
  }

  renderAlbum() {
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
}
