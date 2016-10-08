require('../scss/_playlist.scss')

export default class Playlist {
  constructor(options) {
    Object.assign(this, options)
  }

  render() {
    let albums = this.albums.map(album => {
      return album.render()
    }).join('')

    return `
      <!-- Playlist --!>
      <div class="playlist">
        <div class="playlist__frame playlist__frame--top"></div>
        <div class="playlist__frame playlist__frame--right"></div>
        <div class="playlist__frame playlist__frame--bottom"></div>
        <div class="playlist__frame playlist__frame--left"></div>

        <div class="playlist__progress-bar"></div>
        <a href="#" class="playlist__control playlist__control--prev"></a>
        <a href="#" class="playlist__control playlist__control--next"></a>

        <div class="playlist__albums">
          ${albums}
        </div>
      </div>
    `
  }
}
