export default class Timeline {
  constructor(options) {
    // Props
    Object.assign(this, options)
    this.currentTime  = 0
    this.timeline = null
    // this.getCurrentTime = options.getCurrentTime
  }

  playTimeline() {
    this.timeline = setTimeout(() => {
      requestAnimationFrame(this.playTimeline.bind(this))

      // Set current time
      this.getCurrentTime()
      .then(seconds => {
        this.currentTime = seconds
      })

      this.render(this.currentTime)
    }, 1000/60)
  }

  stopTimeline() {
    clearTimeout(this.timeline)
  }

  getSeconds(timecode) {
    let sec = timecode.split(':')
    let minutes = parseInt(sec[0])
    let seconds = parseInt(sec[1])
    let milliseconds = parseInt(sec[2])
    return (minutes * 60) + (seconds) + milliseconds/30
  }

  getTimecode(seconds) {
    let min = Math.floor(seconds / 60)
    let sec =  Math.floor(seconds - min * 60)
    let milli = Math.floor((seconds - Math.floor(seconds)) * 30)

    // Prefix w/ 0s
    if (min < 10) {
      min = '0' + min
    }

    if (sec < 10) {
      sec = '0' + sec
    }

    if (milli < 10) {
      milli = '0' + milli
    }

    return min + ':' + sec + ':' + milli
  }

  render(seconds) {
    if (seconds) {
      console.log(this.getTimecode(seconds))
    }
  }
}
