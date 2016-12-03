export default class Animation {
  constructor(options) {
    this.id = null
    this.element = null
    this.isPlaying = false
  }

  isReady() {
    return new Promise((resolve, reject) => {
      resolve(true)
    })
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
