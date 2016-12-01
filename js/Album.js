import * as Utils from './Utils.js'
require('../scss/_album.scss')

export default class Album {
  constructor(options) {
    Object.assign(this, options)
    this.handleResize()
  }

  componentDidMount() {
    this.dom = {
      albumFront: document.querySelector(`.album-${this.id} .album__vinyl__front`)
    }
  }

  handleResize() {
    window.addEventListener('resize', event => {
      if (this.dom.albumFront) {
        this.dom.albumFront.innerHTML = this.resizeAlbum()
      }
    })
  }

  resizeAlbum() {
    let album = Utils.isDesktop() ? `<img src="${this.album.images[1].url}" alt=""/>` : ''

    if (Utils.isDesktop() && Utils.isHighDensity()) {
      album = `<img src="${this.album.images[0].url}" alt=""/>`
    }

    return album
  }

  render() {
    return `
      <!-- ${this.album.name} --!>
      <div class="album album-${this.id}">
        <div class="album__track">
          <div class="album__vinyl">
            <div class="album__vinyl__front">
              ${this.resizeAlbum()}
            </div>

            <div class="album__vinyl__back"></div>
          </div>

          <h5 class="album__single">
            ${this.name} (${this.year})
          </h5>

          <h4 class="album__title">
            ${this.album.name.replace(/ *\([^)]*\) */g, '')}
          </h4>
        </div>
      </div>
    `
  }
}
