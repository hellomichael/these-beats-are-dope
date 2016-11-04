import * as Utils from './Utils.js';

export default class Timeline {
  constructor(options) {
    // Props
    this.id = null
    this.timeline = null
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
      this.video.setCurrentTime()
      this.video.setDuration()

      // Play keyframes
      this.playKeyframes()
    }, 1000/60)
  }

  resetTimeline() {
    this.keyframesClone = [...this.keyframes]
    this.video.resetVideo()
  }

  playKeyframes() {
    // Check if there are still keyframes
    let keyframe = this.keyframesClone.length ? this.keyframesClone[0] : null

    if (keyframe && this.video.getCurrentTime() >= Utils.getSeconds(keyframe.timecode)) {
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

  getProgress() {
    let duration = this.video.getEndTime() - this.video.getStartTime()
    let currentTime = this.video.getCurrentTime() - this.video.getStartTime()
    return Utils.getPercentage(currentTime/duration)
  }
}
