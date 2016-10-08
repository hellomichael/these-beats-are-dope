export default class Playlist {
  constructor(options) {
    Object.assign(this, options)
  }

  render() {
    let albums = this.albums.map(album => {
      return album.render()
    }).join('')

    return `
      <!-- Playlist Begin --!>
      <div class="playlist">
        <div class="playlist__frame playlist__frame--top"></div>
        <div class="playlist__frame playlist__frame--right"></div>
        <div class="playlist__frame playlist__frame--bottom"></div>
        <div class="playlist__frame playlist__frame--left"></div>

        <div class="playlist__progress-bar"></div>
        <div class="playlist__control playlist__control--prev"></div>
        <div class="playlist__control playlist__control--next"></div>

        <div class="playlist__albums">
          ${albums}
        </div>
      </div>
      <!-- Playlist End --!>
    `
  }
}
