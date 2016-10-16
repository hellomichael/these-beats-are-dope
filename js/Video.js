import YouTube from 'youtube-player'

export default class Video {
  constructor(options) {
    // Props
    this.youtubeID = null
    this.element = null
    this.duration = -1
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

      // Pause video
      this.stopVideo()
    })
  }

  handleStateChange() {
    this.youtube.on('stateChange', (event) => {
      console.log(`${this.youtubeID}: ${this.states[event.data]}`)
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

  pauseVideo() {
    this.youtube.pauseVideo()
  }

  stopVideo() {
    this.youtube.stopVideo()
  }

  playVideo() {
    this.youtube.playVideo()
  }
}
