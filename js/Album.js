export default class Album {
  constructor(options) {
    Object.assign(this, options)
  }

  render() {
    return `
      <!-- Album Begin --!>
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
      <!-- Album End --!>

    `
  }
}
