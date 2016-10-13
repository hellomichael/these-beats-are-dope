import YouTube from 'youtube-player'
import Timeline from './Timeline.js'
require('../scss/_playlist.scss')

export default class Playlist {
  constructor(options) {
    // Props
    Object.assign(this, options)
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.videos = []
    this.timelines = []
    // this.app = options.app
    // this.timelines = options.timelines
    // this.albums = options.albums

    // Dom
    this.dom = {
      slideshow: null,
      slides: null,
      indicator: null
    }

    // State
    this.state = {
      currentSlide: 0,
      prevSlide:    0,
      direction:    'rtl'
    }

    // Events
    this.handleClick()
    this.handleResize()
    this.render()
  }

  // Mounting
  componentDidMount() {
    this.dom.slideshow = document.querySelector('.playlist__slideshow')
    this.dom.slides = document.querySelectorAll('.playlist__slide')
    this.dom.indicator = document.querySelector('.playlist__progress__indicator')

    this.renderYoutube()
  }

  // Controls
  handleClick() {
    this.app.addEventListener('click', (event) => {
      event.preventDefault()
      this.state.prevSlide = this.state.currentSlide

      // Next
      if (event.target.matches('.playlist__control--next')) {
        if (this.state.currentSlide < this.albums.length - 1) {
          this.state.currentSlide++
          this.state.direction = 'rtl'
          this.animateSlide()
        }
      }

      // Previous
      else if (event.target.matches('.playlist__control--prev')) {
        if (this.state.currentSlide > 0) {
          this.state.currentSlide--
          this.state.direction = 'ltr'
          this.animateSlide()
        }
      }
    })
  }

  // Resizing
  handleResize() {
    window.addEventListener('resize', (event) => {
      // Update state
      this.width = window.innerWidth
      this.height = window.innerHeight

      // Update slideshow
      this.dom.slideshow.style.transform = `translateX(-${this.state.currentSlide * this.width}px)`

      // Update slide
      Array.from(this.dom.slides).map((slide, index) => {
        slide.style.width = `${this.width}px`
        slide.style.height = `${this.height}px`
        slide.style.transform = `translateX(${index * 100}%)`
      })
    })
  }

  // Animations
  animateProgress(seconds) {
    this.videos[this.state.currentSlide].getDuration()
    .then((duration) => {
      this.dom.indicator.style.width = `${(seconds/duration) * 100}%`
    })
  }

  animateSlide() {
    // Set local variables
    let slide = Array.from(this.dom.slideshow.children)[this.state.currentSlide]
    let slideChildren = slide.querySelector('.playlist__content').children
    let slideDistance = (this.state.direction === 'rtl') ? this.width/1.5 : -this.width/1.5
    let slideRotation = (this.state.direction === 'rtl') ? 225 : -225

    // Reset video
    this.videos[this.state.prevSlide].pauseVideo()
    this.videos[this.state.currentSlide].playVideo()

    // Reset timeline
    this.timelines[this.state.prevSlide].stopTimeline()
    this.timelines[this.state.currentSlide].playTimeline(
      this.animateProgress.bind(this)
    )

    // Animate slide
    this.dom.slideshow.style.transform = `translateX(-${this.state.currentSlide * this.width}px)`

    Array.from(slideChildren).map((child, index) => {
      // Reset position
      child.classList.add('no-transition')

      // 3D rotate vinyl
      if (child.classList.contains('album__vinyl')) {
        child.style.transform = `translateX(${slideDistance}px) rotateY(${slideRotation}deg)`
      }

      else {
        child.style.transform = `translateX(${slideDistance}px) rotateY(${slideRotation/10}deg)`
      }

      // Stagger animation
      setTimeout(()=>{
        child.classList.remove('no-transition')
        child.style.transform = `translateX(0) rotateY(-15deg)`
      }, (75 * index) + 15)
    })
  }

  renderYoutube() {
    this.albums.map((album, index) => {
      let video = new YouTube(this.dom.slides[index].querySelector('.video'), {
        width: window.innerWidth,
        height: window.innerHeight + 600,
        videoId: album.youtubeID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showInfo: 0,
          iv_load_policy: 3,
        }
      })

      // Events
      video.on('ready', (event) => {
        video.setPlaybackQuality('hd720')
        video.pauseVideo()

        video.getIframe()
        .then(iframe => {
          window.addEventListener('resize', event => {
            iframe.setAttribute('width', window.innerWidth)
            iframe.setAttribute('height', window.innerHeight + 600)
          })
        })
      })

      video.on('stateChange', (event) => {
        let stateNames = {
          '-1': 'unstarted',
          0: 'ended',
          1: 'playing',
          2: 'paused',
          3: 'buffering',
          5: 'video cued'
        }
      })

      this.timelines.push(new Timeline({
        getCurrentTime: video.getCurrentTime
      }))

      this.videos.push(video)
    })
  }

  render() {
    let playlistSlides = this.albums.map((album, index) => {
      return `
        <div class="playlist__slide" style="transform: translateX(${index * 100}%); width: ${this.width}px; height: ${this.height}px;">
          <div class="video"></div>

          ${album.render()}
        </div>`
    }).join('')

    this.app.innerHTML = `
      <!-- Playlist --!>
      <div class="playlist">
        <div class="playlist__slideshow" style="width: ${this.width * (this.albums.length)}px; height: ${this.height}px;">
          ${playlistSlides}
        </div>

        <div class="playlist__progress">
          <div class="playlist__progress__track"></div>
          <div class="playlist__progress__indicator"></div>
        </div>

        <a href="#" class="playlist__control playlist__control--prev"></a>
        <a href="#" class="playlist__control playlist__control--next"></a>

        <div class="playlist__frame playlist__frame--top"></div>
        <div class="playlist__frame playlist__frame--right"></div>
        <div class="playlist__frame playlist__frame--bottom"></div>
        <div class="playlist__frame playlist__frame--left"></div>
      </div>
    `

    return this.componentDidMount()
  }
}
