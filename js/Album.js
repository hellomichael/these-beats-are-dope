require('../scss/_album.scss')

export default class Album {
  constructor(options) {
    Object.assign(this, options)

    console.log
  }

  render() {
    return `
      <!-- ${this.album.name} --!>
      <div class="album">
        <div class="playlist__content album__track">
          <div class="album__vinyl">
            <div class="album__vinyl__front"><img src="${this.album.images[0].url}" alt=""/></div>
            <div class="album__vinyl__back"></div>
          </div>

          <h5 class="album__single">
            ${this.name}
          </h4>

          <h3 class="album__title">
            ${this.album.name.replace(/ *\([^)]*\) */g, '')}
          </h2>
        </div>
      </div>
    `
  }
}
