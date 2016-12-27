import YouTube from 'youtube-player'
import * as Utils from './Utils.js'
require('../scss/_video.scss')

export default class Video {
  constructor(options) {
    // Props
    this.id = null
    this.name = null
    this.element = null
    this.startTime = 0
    this.endTime = 0
    this.pauseTime = 0
    this.currentTime = 0
    this.duration = -1
    this.isBuffering = false
    this.isPlaying = false
    this.isPaused = false
    this.quality = 'small'  //small, medium, large, hd720, hd1080, highres
    this.volume = 100
    this.isMute = false
    this.fadeInterval = null
    this.events = {
      '-2': 'Ready',
      '-1': 'Unstarted',
      0: 'Ended',
      1: 'Playing',
      2: 'Paused',
      3: 'Buffering',
      5: 'Video cued'
    }
    Object.assign(this, options)

    // Youtube
    this.youtube = new YouTube(this.element, {
      width: window.innerWidth,
      height: window.innerHeight + 600,
      videoId: options.id,
      playerVars: {
        autoplay: 0,
        fs: 0,
        playsinline: 1,
        loop: 0,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showInfo: 0,
        iv_load_policy: 3
      }
    })

    // State
    this.state = {
      event: -1
    }

    // Events
    this.handleReady()
    this.handleStateChange()
    // this.handleQualityChange()
    this.handleResize()
  }

  handleReady() {
    this.youtube.on('ready', () => {
      console.log(`${this.name} (${this.id}): Ready`)
      this.youtube.setPlaybackQuality(this.quality)
      this.setDuration()
      // this.prefetchVideo()
    })
  }

  // Set Quality
  handleQualityChange() {
    this.youtube.on('onPlaybackQualityChange', () => {
      this.youtube.setPlaybackQuality(this.quality)
    })
  }

  handleStateChange() {
    this.youtube.on('stateChange', event => {
      console.log(`${this.name} (${this.id}): ${this.events[event.data]}`)

      this.state.event = event.data

      if (this.events[event.data] === 'Playing') {
        this.isBuffering = false
        this.fadeIn()
        this.fadeVideoIn()
      }

      else if (this.events[event.data] === 'Buffering') {
        this.isBuffering = true
      }
    })
  }

  handleResize() {
    window.addEventListener('resize', () => {
      this.youtube.getIframe()
      .then(iframe => {
        iframe.setAttribute('width', window.innerWidth)
        iframe.setAttribute('height', window.innerHeight + 600)
        i
      })
    })
  }

  isReady() {
    return new Promise(resolve => {
      this.youtube.on('ready', event => {
        console.log(`${this.name} (${this.id}): ${this.events[-2]}`)
        resolve(event)
      })
    })
  }

  muteVideo() {
    this.isMute = !this.isMute

    if (this.isMute){
      this.youtube.mute()
    }

    else {
      this.youtube.unMute()
    }
  }

  prefetchVideo() {
    console.log(`${this.name} (${this.id}): Prefetch Video`)

    if (this.pauseTime) {
      this.youtube.seekTo(this.pauseTime)
    }

    else {
      this.youtube.seekTo(this.startTime)
    }

    this.youtube.setVolume(0)
    this.youtube.pauseVideo()
  }

  loopVideo () {
    console.log(`${this.name} (${this.id}): Loop Video`)

    if (this.isPaused) {
      return Promise.resolve()
    }

    this.isPlaying = false

    return this.fadeOut()
    .then(() => {
      this.isPlaying = true
      this.isPaused = false
      this.youtube.seekTo(this.startTime)
      this.youtube.setVolume(0)
      this.fadeIn()
    })
  }

  playVideo() {
    this.isPlaying = true
    this.isPaused = false
    this.youtube.playVideo()
  }

  stopVideo() {
    this.youtube.stopVideo()
    this.youtube.setVolume(0)
  }

  pauseVideo() {
    this.isPlaying = false
    this.isPaused = true

    return this.fadeOut()
    .then(() => {
      this.pauseTime = (this.getCurrentTime() >= (this.endTime - 5)) ? this.startTime : this.getCurrentTime()

      if (this.isMobile) {
        setTimeout(() => {
          this.youtube.stopVideo()
        }, 750)
      }

      else {
        this.youtube.seekTo(this.pauseTime)
        this.youtube.pauseVideo()
      }

      this.youtube.setVolume(0)
    })
  }

  setDuration() {
    return this.youtube.getDuration()
    .then(seconds => {
      this.duration = Utils.getTwoDecimalPlaces(seconds)
    })
  }

  setCurrentTime() {
    return this.youtube.getCurrentTime()
    .then(seconds => {
      this.currentTime = Utils.getTwoDecimalPlaces(seconds)
    })
  }

  getDuration() {
    return this.duration
  }

  getCurrentTime() {
    return this.currentTime
  }

  getStartTime() {
    return this.startTime
  }

  getEndTime() {
    return this.endTime
  }

  fadeVideoIn() {
    this.youtube.getIframe()
    .then(iframe => {
      iframe.classList.add('video--visible')
    })
  }

  fadeIn() {
    return new Promise((resolve) => {
      let volume = 0

      clearInterval(this.fadeInterval)
      this.fadeInterval = setInterval(() => {
        if (volume < this.volume) {
          volume += 2.5
          this.youtube.setVolume(volume)
        }

        else {
          this.youtube.setVolume(this.volume)
          clearInterval(this.fadeInterval)
          resolve()
        }
      }, 15)
    })
  }

  fadeOut() {
    return new Promise(resolve => {
      if (this.isBuffering) {
        this.youtube.setVolume(0)
        clearInterval(this.fadeInterval)
        resolve()
      }

      else {
        let volume = this.volume

        clearInterval(this.fadeInterval)
        this.fadeInterval = setInterval(() => {
          if (this.isPlaying) {
            clearInterval(this.fadeInterval)
          }

          else {
            if (volume > 0) {
              volume -= 2.5
              this.youtube.setVolume(volume)
            }

            else {
              this.youtube.setVolume(0)
              clearInterval(this.fadeInterval)

              setTimeout(() => {
                resolve()
              }, 250)
            }
          }
        }, 15)
      }
    })
  }
}
