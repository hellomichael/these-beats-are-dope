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
    this.isPlaying = false
    this.isPaused = false
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
    this.handleResize()
  }

  handleReady() {
    this.youtube.on('ready', event => {
      console.log(`${this.name} (${this.id}): Ready`)
      // Set quality (small, medium, large, hd720, hd1080, highres)
      this.youtube.setPlaybackQuality('small')
      this.setDuration()
    })
  }

  handleStateChange() {
    this.youtube.on('stateChange', event => {
      console.log(`${this.name} (${this.id}): ${this.events[event.data]}`)
      this.state.event = event.data

      if (this.events[event.data] === 'Playing') {
        this.fadeIn()
        this.fadeVideoIn()
      }
    })
  }

  handleResize() {
    window.addEventListener('resize', event => {
      this.youtube.getIframe()
      .then(iframe => {
        iframe.setAttribute('width', window.innerWidth)
        iframe.setAttribute('height', window.innerHeight + 600)
      })
    })
  }

  isReady() {
    return new Promise((resolve, reject) => {
      this.youtube.on('ready', event => {
        console.log(`${this.name} (${this.id}): ${this.events[-2]}`)
        resolve(event)
      })
    })
  }

  isPlaying() {
    return new Promise((resolve, reject) => {
      this.youtube.on('stateChange', event => {
        if (this.events[event.data] === 'Playing') {
          resolve(event)
        }
      })
    })
  }

  isStopped() {
    return new Promise((resolve, reject) => {
      this.youtube.on('stateChange', event => {
        if (this.events[event.data] === 'Unstarted') {
          resolve(event)
        }
      })
    })
  }

  isPaused() {
    return new Promise((resolve, reject) => {
      this.youtube.on('stateChange', event => {
        if (this.events[event.data] === 'isPaused') {
          resolve(event)
        }
      })
    })
  }

  muteVideo() {
    this.isMute = !this.isMute

    if (this.isMute ) {
      this.youtube.setVolume(0)
    }

    else {
      this.youtube.setVolume(1000)
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

  seekVideo(seconds) {
    this.youtube.seekTo(seconds)
  }

  stopVideo() {
    this.isPlaying = false
    this.isPaused = true

    this.fadeOut()
    .then(() => {
      this.youtube.stopVideo()
    })
  }

  pauseVideo() {
    this.isPlaying = false
    this.isPaused = true
    this.pauseTime = this.getCurrentTime()

    return this.fadeOut()
    .then(() => {
      if (this.pauseTime >= (this.endTime - 5)) {
        this.pauseTime = 0
        this.youtube.seekTo(this.startTime)
      }

      this.youtube.setVolume(0)
      this.youtube.pauseVideo()
    })
  }

  setDuration() {
    return this.youtube.getDuration()
    .then(seconds => {
      this.duration = Utils.getTwoDecimalPlaces(seconds)
    })
  }

  getDuration() {
    return this.duration
  }

  setCurrentTime() {
    return this.youtube.getCurrentTime()
    .then(seconds => {
      this.currentTime = Utils.getTwoDecimalPlaces(seconds)
    })
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

  fadeIn(startVolume, callback) {
    return new Promise((resolve, reject) => {
      let volume = 0

      clearInterval(this.fadeInterval)
      this.fadeInterval = setInterval(() => {
        if (volume < 100) {
          volume += 2.5
          this.youtube.setVolume(volume)
        }

        else {
          this.youtube.setVolume(100)
          clearInterval(this.fadeInterval)
          resolve()
        }
      }, 15)
    })
  }

  fadeOut() {
    return new Promise((resolve, reject) => {
      let volume = 100

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
            resolve()
          }
        }
      }, 15)
    })
  }
}
