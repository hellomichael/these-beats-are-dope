import YouTube from 'youtube-player'

export default class Video {
  constructor(options) {
    // Props
    this.youtubeID = null
    this.element = null
    this.duration = -1
    this.fadeInterval = null
    Object.assign(this, options)

    this.youtube = new YouTube(options.element, {
      width: window.innerWidth,
      height: window.innerHeight + 600,
      videoId: options.youtubeID,
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
    this.states = {
      '-1': 'Unstarted',
      0: 'Ended',
      1: 'Playing',
      2: 'Paused',
      3: 'Buffering',
      5: 'Video cued'
    }

    // Events
    this.handleOnReady()
    this.handleStateChange()
    this.handleResize()
  }

  handleOnReady() {
    this.youtube.on('ready', (event) => {
      // Set quality
      //this.youtube.setPlaybackQuality('hd720')
      this.youtube.setPlaybackQuality('small')

      // Set duration
      this.youtube.getDuration()
      .then((duration) => {
        this.duration = duration
      })

      // Stop video
      this.youtube.pauseVideo()
      this.youtube.seekTo(0)
    })
  }

  handleStateChange() {
    this.youtube.on('stateChange', (event) => {
      // console.log(`${this.youtubeID}: ${this.states[event.data]}`)
    })
  }

  handleResize() {
    this.youtube.getIframe()
    .then(iframe => {
      window.addEventListener('resize', event => {
        iframe.setAttribute('width', window.innerWidth)
        iframe.setAttribute('height', window.innerHeight + 600)
      })
    })
  }

  getDuration() {
    return this.duration
  }

  seekVideo(seconds) {
    this.youtube.seekTo(seconds)
  }

  playVideo() {
    this.fadeIn()
    this.youtube.playVideo()
  }

  stopVideo() {
    this.fadeOut(() => {
      this.youtube.pauseVideo()
      this.youtube.seekTo(0)
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
