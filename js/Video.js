import YouTube from 'youtube-player'
require('../scss/_video.scss')

export default class Video {
  constructor(options) {
    // Props
    this.id = null
    this.name = null
    this.element = null
    this.startSeconds = 0
    this.fadeInterval = null
    Object.assign(this, options)

    this.youtube = new YouTube(this.element, {
      width: window.innerWidth,
      height: window.innerHeight + 600,
      videoId: options.id,
      playerVars: {
        autoplay: 1,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showInfo: 0,
        iv_load_policy: 3,
      }
    })

    // State
    this.state = {
      events: {
        '-1': 'Unstarted',
        0: 'Ended',
        1: 'Playing',
        2: 'Paused',
        3: 'Buffering',
        5: 'Video cued'
      }
    }

    // Events
    this.handleOnReady()
    this.handleStateChange()
    this.handleResize()
  }

  handleOnReady() {
    this.youtube.on('ready', event => {
      // Set quality
      //this.youtube.setPlaybackQuality('hd720')
      this.youtube.setPlaybackQuality('small')

      // Stop video
      // this.youtube.pauseVideo()
      // this.youtube.seekTo(this.startSeconds)
      this.youtube.stopVideo()
      this.youtube.setVolume(0)
    })
  }

  handleStateChange() {
    this.youtube.on('stateChange', event => {
      console.log(`${this.name}: ${this.state.events[event.data]}`)

      if (this.state.events[event.data] === 'Playing') {
        this.fadeIn()
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

  seekVideo(seconds) {
    this.youtube.seekTo(seconds)
  }

  playVideo() {
    this.youtube.seekTo(this.startSeconds)
    this.youtube.playVideo()
  }

  stopVideo() {
    this.fadeOut(() => {
      this.youtube.stopVideo()
      // this.youtube.pauseVideo()
      // this.youtube.seekTo(0)
    })
  }

  pauseVideo() {
    this.fadeOut(() => {
      this.youtube.pauseVideo()
    })
  }

  fadeIn(callback) {
    this.youtube.getVolume()
    .then(currentVolume => {
      let volume = currentVolume

      clearInterval(this.fadeInterval)
      this.fadeInterval = setInterval(() => {
        if (volume < 100) {
          volume += 2.5

          this.youtube.setVolume(volume)
        }

        else {
          this.youtube.setVolume(100)
          clearInterval(this.fadeInterval)

          if (callback) {
            callback()
          }
        }
      }, 50)
    })
  }

  fadeOut(callback) {
    this.youtube.getVolume()
    .then(currentVolume => {
      let volume = currentVolume

      clearInterval(this.fadeInterval)
      this.fadeInterval = setInterval(() => {
        if (volume > 0) {
          volume -= 2.5
          this.youtube.setVolume(volume)
        }

        else {
          this.youtube.setVolume(0)
          clearInterval(this.fadeInterval)

          if (callback) {
            callback()
          }
        }
      }, 50)
    })
  }
}
