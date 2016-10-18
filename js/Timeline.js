import * as Utils from './Utils.js';

export default class Timeline {
  constructor(options) {
    // Props
    this.id = null
    this.timeline = null
    this.requestAnimationFrame = null
    this.currentTime = 0
    this.duration = -1
    this.keyframes = []
    this.keyframesClone = [...this.keyframes]
    Object.assign(this, options)

    this.setDuration()
    .then((duration) => {
      this.duration = duration
    })
  }

  stopTimeline() {
    cancelAnimationFrame(this.requestAnimationFrame)
    clearTimeout(this.timeline)
  }

  playTimeline() {
    this.timeline = setTimeout(() => {
      this.requestAnimationFrame = requestAnimationFrame(this.playTimeline.bind(this))

      // Set current time
      this.setCurrentTime()
      .then(seconds => {
        this.currentTime = seconds
      })

      // Play keyframes
      this.playKeyframes()

      // console.log(`${this.id}: ${this.getCurrentTime(true)}`)
    }, 1000/60)
  }

  playKeyframes() {
    let keyframe = this.keyframesClone.length ? this.keyframesClone[0] : null

    if (keyframe && this.getCurrentTime() >= Utils.getSeconds(keyframe.timecode)) {
      this.keyframesClone.shift();
    }
  }

  getCurrentTime(timecode) {
    if (timecode) {
      return Utils.getTimecode(this.currentTime.toFixed(2))
    }

    else {
      return this.currentTime.toFixed(2)
    }
  }

  getDuration(timecode) {
    if (timecode) {
      return Utils.getTimecode(this.duration.toFixed(2))
    }

    else {
      return this.duration.toFixed(2)
    }
  }

  getProgress(timecode) {
    if (timecode) {
      return Utils.getTimecode((this.getCurrentTime()/this.getDuration() * 100).toFixed(2))
    }

    else {
      return (this.getCurrentTime()/this.getDuration() * 100).toFixed(2)
    }
  }
}
