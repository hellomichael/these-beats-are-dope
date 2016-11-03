import * as Utils from './Utils.js';

export default class Timeline {
  constructor(options) {
    // Props
    this.id = null
    this.timeline = null
    this.currentTime = 0
    this.duration = -1
    this.requestAnimationFrame = null
    this.video = null
    this.animation = null
    this.keyframes = []
    Object.assign(this, options)
    this.keyframesClone = [...this.keyframes]
  }

  stopTimeline() {
    cancelAnimationFrame(this.requestAnimationFrame)
    clearTimeout(this.timeline)
  }

  playTimeline() {
    this.timeline = setTimeout(() => {
      this.requestAnimationFrame = requestAnimationFrame(this.playTimeline.bind(this))

      // Set current time
      this.video.youtube.getCurrentTime()
      .then(seconds => {
        this.currentTime = Utils.getTwoDecimalPlaces(seconds)
      })

      // Set duration
      this.video.youtube.getDuration()
      .then((duration) => {
        this.duration = Utils.getTwoDecimalPlaces(duration)
      })

      // Play keyframes
      this.playKeyframes()

      // console.log(`${this.id}: ${this.getCurrentTime(true)}`)
    }, 1000/60)
  }

  resetTimeline() {
    this.keyframesClone = [...this.keyframes]
    this.video.resetVideo()
  }

  playKeyframes() {
    // Check if there are still keyframes
    let keyframe = this.keyframesClone.length ? this.keyframesClone[0] : null

    if (keyframe && this.getCurrentTime() >= Utils.getSeconds(keyframe.timecode)) {
      // Repeat video if last frame
      if (this.keyframesClone.length === 1) {
        this.resetTimeline()
      }

      // Play the action if is a function
      else if (typeof this.animation[keyframe.action] === 'function') {
        this.animation[keyframe.action]()
      }

      // Remove the keyframe
      this.keyframesClone.shift()
    }
  }

  getCurrentTime(timecode) {
    if (timecode) {
      return Utils.getTimecode(this.currentTime)
    }

    else {
      return this.currentTime
    }
  }

  getDuration(timecode) {
    if (timecode) {
      return Utils.getTimecode(this.duration)
    }

    else {
      return this.duration
    }
  }

  getProgress(timecode) {
    if (timecode) {
      return Utils.getTimecode((this.getCurrentTime()/this.getDuration() * 100))
    }

    else {
      return (this.getCurrentTime()/this.getDuration() * 100)
    }
  }
}
