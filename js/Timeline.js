import * as Utils from './Utils.js'

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
    this.isResetting = false
    this.isLoop = false
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
      .then(() => {
        // Play keyframes
        this.playKeyframes()
      })

    }, 1000/60)
  }

  loopTimeline() {
    this.isResetting = true

    this.video.loopVideo()
    .then(() => {
      this.generateKeyframes()
      this.isResetting = false
    })
  }

  resetTimeline() {
    this.generateKeyframes()
  }

  generateKeyframes() {
    this.keyframesClone = []

    this.keyframes.map((keyframe, index) => {
      let bpm = 60/keyframe.bpm
      let threshold = 0.35
      let currentTime = Utils.getSeconds(this.keyframes[index].timecode)
      let actions = this.keyframes[index].actions ? this.keyframes[index].actions : null

      // Generate automatic keyframes if bpm provided
      if (isFinite(bpm)) {
        let nextTime = Utils.getSeconds(this.keyframes[index + 1].timecode)

        // Loop between current and next times
        if (isFinite(bpm)) {
          for (var i=currentTime; i <= (nextTime - threshold); i += bpm) {
            if (i < nextTime) {
              // console.log('Automatic Timecode', actions, Utils.getTimecode(i))

              this.keyframesClone.push({
                timecode: Utils.getTimecode(i),
                actions
              })
            }
          }
        }
      }

      // Generate manual keyframes
      else {
        // console.log('Manual Timecode', actions, Utils.getTimecode(currentTime))

        this.keyframesClone.push({
          timecode: Utils.getTimecode(currentTime),
          actions
        })
      }
    })
  }

  removeKeyframes() {
    let skippedKeyframes = 0

    this.keyframesClone.map((keyframe) => {
      if (this.video.getCurrentTime() > Utils.getSeconds(keyframe.timecode)) {
        skippedKeyframes++
      }
    })

    if (skippedKeyframes) {
      this.keyframesClone.splice(0, (skippedKeyframes - 1))
    }
  }

  playKeyframes() {
    // Remove skipped keyframes
    this.removeKeyframes()

    // Check if there are still keyframes left
    let keyframe = this.keyframesClone.length ? this.keyframesClone[0] : null

    if (keyframe && this.video.getCurrentTime() >= Utils.getSeconds(keyframe.timecode)) {
      // Play the actions
      if (keyframe.actions) {
        keyframe.actions.map(action => {
          // Check if function exists in Animation class
          if (typeof this.animation[action] === 'function') {
            this.animation[action]()
          }
        })
      }

      // Loop or next slide
      if (this.keyframesClone.length <= 1 && !this.isResetting) {
        if (this.isLoop) {
          this.loopTimeline()
        }

        else {
          this.nextSlide()
        }
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
