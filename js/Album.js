import * as Utils from './Utils.js'
require('../scss/_album.scss')

export default class Album {
  constructor(options) {
    Object.assign(this, options)
    this.handleResize()
  }

  componentDidMount() {
    this.element = document.querySelector(`.album-${this.id}`)

    this.dom = {
      albumCover: document.querySelector(`.album-${this.id} .album__vinyl__front img`)
    }
  }

  handleResize() {
    window.addEventListener('resize', () => {
      if (this.dom.albumCover) {
        this.dom.albumCover.src = this.resizeAlbum()
      }
    })
  }

  resizeAlbum() {
    let albumCover = this.album.images[1].url

    if (Utils.isHighDensity() || !this.isMobile) {
      albumCover = this.album.images[0].url
    }

    return albumCover
  }

  render() {
    return `
      <!-- ${this.album.name} --!>
      <div class="album album-${this.id}">
        <div class="album__track">
          <div class="album__vinyl">
            <a href="#" class="playlist__control playlist__control--play"><i class="icon icon--lg icon--play"></i></a>

            <div class="album__vinyl__front">
              <img src="${this.resizeAlbum()}" alt=""/>
            </div>

            <div class="album__vinyl__back"></div>
          </div>

          <h5 class="album__single">
            ${this.name} <span class="album__year">(${this.year})</span>
          </h5>

          <h3 class="album__title">
            ${this.album.name.replace(/ *\([^)]*\) */g, '')}
          </h3>
        </div>
      </div>
    `
  }
}
