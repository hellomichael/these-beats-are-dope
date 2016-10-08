require('../scss/_album.scss')

export default class Album {
  constructor(options) {
    Object.assign(this, options)
  }

  render() {
    return `
      <!-- ${this.album.name} --!>
      <div class="album">
        <div class="album__video">

        </div>

        <div class="album__track">
          <div class="album__cd cd">
            <div class="cd__front"><img src="${this.album.images[1].url}" alt=""/></div>
            <div class="cd__back"></div>
          </div>

          <h4 class="album__single">
            ${this.name}
          </h4>

          <h2 class="album__title">
            ${this.album.name}
          </h2>
        </div>
      </div>
    `
  }
}
