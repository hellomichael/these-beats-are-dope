require('../scss/_album.scss')

export default class Album {
  constructor(options) {
    Object.assign(this, options)
  }

  render() {
    let album = window.innerWidth >= 480 ? `<img src="${this.album.images[1].url}" alt=""/>` : ''

    return `
      <!-- ${this.album.name} --!>
      <div class="album album-${this.id}">
        <div class="album__track">
          <div class="album__vinyl">
            <div class="album__vinyl__front">
              ${album}
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
