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
    this.keyframesCache = []
    this.keyframesClone = []
    this.isResetting = false
    this.isLoop = false
    this.nextSlide = null
    this.threshold = 0

    Object.assign(this, options)
    this.generateKeyframes()
  }

  stopTimeline() {
    this.resetTimeline()
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
    this.stopTimeline()
    this.isResetting = true

    this.video.loopVideo()
    .then(() => {
      this.resetTimeline()
      this.isResetting = false
      this.playTimeline()
    })
  }

  resetTimeline() {
    this.keyframesClone = [...this.keyframesCache]
  }

  generateKeyframes() {
    this.keyframesClone = []

    this.keyframes.map((keyframe, index) => {
      let bpm = 60/keyframe.bpm
      let currentTime = Utils.getSeconds(this.keyframes[index].timecode)
      let nextTime = ((index + 1) < this.keyframes.length) ? Utils.getSeconds(this.keyframes[index + 1].timecode): 0
      let duration = nextTime - currentTime
      let repetitions = isFinite(bpm) ? Math.round(duration/bpm) : 0
      let actions = this.keyframes[index].actions ? this.keyframes[index].actions : []

      // Generate automatic keyframes if bpm provided
      if (isFinite(bpm)) {
        let bpmCount = 0

        // Loop between current and next times
        for (var i=currentTime; i <= (nextTime - this.threshold); i += bpm) {
          if (i < nextTime) {
            let actionsClone = [...actions]

            // Open/close eyes through long bopping
            if ((repetitions > 30 && bpmCount%15 === 1) || !bpmCount) {
              actionsClone.push('openCloseEyes')
            }

            else if ((repetitions > 15) && (bpmCount === Math.round(repetitions/2)) || !bpmCount) {
              actionsClone.push('openCloseEyes')
            }

            this.keyframesClone.push({
              timecode: Utils.getTimecode(i),
              bpm: bpm,
              actions: actionsClone
            })

            bpmCount++
          }
        }
      }

      // Generate manual keyframes
      else {
        let actionsClone = actions ? [...actions] : []

        // Open/close eyes if breathing with long duration
        if (actionsClone.includes('breathing') && !actionsClone.includes('openCloseEyes') && duration > 5) {
          actionsClone.push('openCloseEyes')
        }

        this.keyframesClone.push({
          timecode: Utils.getTimecode(currentTime),
          actions
        })
      }
    })

    this.keyframesCache = [...this.keyframesClone]
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
    let nextKeyframe = this.keyframesClone.length > 2 ? this.keyframesClone[1] : null
    let keyframeBpm = keyframe ? keyframe.bpm : 0
    let keyframeDuration = nextKeyframe ? Utils.getTwoDecimalPlaces(Utils.getSeconds(nextKeyframe.timecode) - Utils.getSeconds(keyframe.timecode)) : 0

    if (keyframe && this.video.getCurrentTime() >= Utils.getSeconds(keyframe.timecode)) {
      // Play the actions
      if (keyframe.actions) {
        keyframe.actions.map(action => {
          // Check if function exists in Animation class
          if (typeof this.animation[action] === 'function') {
            if (action === 'bopper') {
              // Automated bops with bopCycle
              if (Utils.getBPM(keyframeBpm) >= 115) {
                this.animation['bopper']('fast', 'cycle')
              }

              else if (Utils.getBPM(keyframeBpm) >= 85) {
                this.animation['bopper']('medium', 'cycle')
              }

              else if (Utils.getBPM(keyframeBpm) >= 60) {
                this.animation['bopper']('normal', 'cycle')
              }

              else if (Utils.getBPM(keyframeBpm)) {
                this.animation['bopper']('slow', 'cycle')
              }

              // Manual bops with bopAngle
              else if (Utils.getBPM(keyframeDuration) >= 115) {
                this.animation['bopper']('fast', 'angle')
              }

              else if (Utils.getBPM(keyframeDuration) >= 85) {
                this.animation['bopper']('medium', 'angle')
              }

              else if (Utils.getBPM(keyframeDuration) >= 60) {
                this.animation['bopper']('normal', 'angle')
              }

              else if (Utils.getBPM(keyframeDuration)) {
                this.animation['bopper']('slow', 'angle')
              }
            }

            else {
              this.animation[action]()
            }

            // Automatic breathing
            if (action === 'bopper' || action === 'bopCycle' || action === 'bopCycleFast' || action === 'bopAngle' || action === 'bopAngleFast') {
              // Single manual action (no bpm)
              if (keyframeDuration > 1.5) {
                setTimeout(() => {
                  this.animation['breathing']()

                  if (keyframeDuration > 10) {
                    this.animation['openCloseEyes']()
                  }
                }, (keyframeDuration > 10) ? 750 : 500)

                this.animation['closeEyes']()
              }
            }
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
