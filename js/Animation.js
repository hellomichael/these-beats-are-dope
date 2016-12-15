export default class Animation {
  constructor(options) {
    this.id = null
    this.element = null
    this.isPlaying = false
  }

  isReady() {
    return Promise.resolve()
  }

  stopAnimation() {
    // console.log('Stop Animation')
  }

  playAnimation() {
    // console.log('Play Animation')
  }

  render() {
    return (`
      <div class="animation animation-${this.id}"></div>
    `)
  }
}
