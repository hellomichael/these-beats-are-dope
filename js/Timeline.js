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
    this.keyframesClone = []
    this.nextSlide = null
    Object.assign(this, options)

    this.generateKeyframes()
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
    this.video.resetVideo()
    .then(() => {
      this.generateKeyframes()
    })
  }

  generateKeyframes() {
    // Clone Keyframes
    // this.keyframesClone = [...this.keyframes]

    // Generated Keyframes
    this.keyframes.map((keyframe, index) => {
      let bpm = 60/keyframe.bpm
      let threshold = 0.25
      let currentTime = Utils.getSeconds(this.keyframes[index].timecode)
      let action = this.keyframes[index].action ? this.keyframes[index].action : null

      // Generate automatic keyframes if bpm provided
      if (isFinite(bpm)) {
        let nextTime = Utils.getSeconds(this.keyframes[index + 1].timecode)

        // Loop between current and next times
        if (isFinite(bpm)) {
          for (var i=currentTime; i <= (nextTime - threshold); i += bpm) {
            if (i < nextTime) {
              console.log('Automatic Timecode', action, Utils.getTimecode(i))

              this.keyframesClone.push({
                timecode: Utils.getTimecode(i),
                action
              })
            }
          }
        }
      }

      // Manual keyframes
      else {
        console.log('Manual Timecode', action, Utils.getTimecode(currentTime))

        this.keyframesClone.push({
          timecode: Utils.getTimecode(currentTime),
          action
        })
      }
    })
  }

  playKeyframes() {
    // Check to see if current time is ahead of first keyframe
    let skippedKeyframes = 0;

    this.keyframesClone.map((keyframe) => {
      if (this.video.getCurrentTime() > Utils.getSeconds(keyframe.timecode)) {
        skippedKeyframes++
      }
    })

    // Remove the skipped frames from the array
    if (skippedKeyframes) {
      this.keyframesClone.splice(0, (skippedKeyframes - 1))
    }

    // Check if there are still keyframes
    let keyframe = this.keyframesClone.length ? this.keyframesClone[0] : null

    if (keyframe && this.video.getCurrentTime() >= Utils.getSeconds(keyframe.timecode)) {
      // Play the action if is a function
      if (typeof this.animation[keyframe.action] === 'function') {
        this.animation[keyframe.action]()
      }

      // Next slide for last frame
      if (this.keyframesClone.length === 1) {
        this.nextSlide()
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
