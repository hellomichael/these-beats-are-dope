require('../scss/_disclaimer.scss')

export default class Disclaimer {
  render() {
    return (`
      <div class="disclaimer">
        <div class="disclaimer__content">
          <h2 class="disclaimer__heading">These beats are dope, but portrait mode ain't.</h2>
          <h5 class="disclaimer__heading">Please rotate your mobile device for the full Kanye experience.</h5>
        </div>
      </div>
    `)
  }
}
