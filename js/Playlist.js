import Album from './Album.js'
import Video from './Video.js'
import Timeline from './Timeline.js'
import Aziz from './Aziz.js'
import Animation from './Animation.js'
import * as Utils from './Utils.js'
require('../scss/_playlist.scss')

export default class Playlist {
  constructor(options) {
    // Props
    this.app = null
    this.playlist = []

    this.albums = []
    this.videos = []
    this.timelines = []
    this.animations = []

    this.width = window.innerWidth
    this.height = window.innerHeight
    Object.assign(this, options)

    // Dom
    this.dom = {
      slideshow: null,
      slides: null,
      indicator: null,
      controls: null
    }

    // State
    this.state = {
      currentSlide: 0,
      prevSlide:    0,
      direction:    'rtl'
    }

    // Set data
    this.setAnimations()
    this.setAlbums()
    .then(albums => {
      this.albums = albums
      this.render()
    })
  }

  setAnimations() {
    this.playlist.map(slide => {
      this.animations.push(slide.animation === 'Aziz' ? new Aziz() : new Animation({id: slide.youtubeID}))
    })
  }

  setAlbums() {
    let promises = []

    this.playlist.map(slide => {
      console.log(slide)
      let promise = fetch(`https://api.spotify.com/v1/tracks/${slide.spotifyID}`)
      .then(response => response.json())
      .then(data => {
        return new Album(Object.assign({id:slide.youtubeID, year:slide.year}, data))
      })

      promises.push(promise)
    })

    return Promise.all(promises)
  }

  setVideos() {
    this.playlist.map((slide, index) => {
      let video = new Video({
        id:             slide.youtubeID,
        name:           this.albums[index].name,
        element:        this.dom.slideshowVideos.children[index].querySelector('.video'),
        startTime:      Utils.getSeconds(slide.keyframes[0].timecode),
        endTime:        Utils.getSeconds(slide.keyframes[slide.keyframes.length - 1].timecode)
      })

      this.videos.push(video)
    })
  }

  setTimelines() {
    this.playlist.map((slide, index) => {
      let timeline = new Timeline({
        id:             slide.youtubeID,
        video:          this.videos[index],
        animation:      this.animations[index],
        keyframes:      slide.keyframes,
        nextSlide:      this.nextSlide.bind(this)
      })

      this.timelines.push(timeline)
    })
  }

  // Ready
  handleReady() {
    let promises = []

    this.videos.map(video => {
      promises.push(video.isReady())
    })

    Promise.all(promises)
    .then(() => {
      this.animateSlide()
    })
  }

  // Controls
  handleClick() {
    this.app.addEventListener('click', event => {
      event.preventDefault()

      // Next
      if (event.target.matches('.playlist__control--next') || event.target.matches('.playlist__play')) {
        this.nextSlide()
      }

      // Previous
      else if (event.target.matches('.playlist__control--prev')) {
        this.prevSlide()
      }
    })
  }

  handleKeypress() {
    window.addEventListener('keydown', event => {
      event.preventDefault()

      // Next
      if (event.keyCode === 39) {
        this.nextSlide()
      }

      // Previous
      else if (event.keyCode === 37) {
        this.prevSlide()
      }

      // Spacebar
      else if (event.keyCode === 32) {
        console.log(Utils.getTimecode(this.videos[this.state.currentSlide].getCurrentTime()))
      }
    })
  }

  // Resizing
  handleResize() {
    window.addEventListener('resize', event => {
      // Update state
      this.width = window.innerWidth
      this.height = window.innerHeight

      // Update slideshow
      Array.from(this.dom.slideshows).map(slideshow => {
        slideshow.style.transform = `translateX(-${this.state.currentSlide * this.width}px)`

        // Update children
        Array.from(slideshow.children).map((slide, index) => {
          slide.style.width = `${this.width}px`
          slide.style.height = `${this.height}px`
          slide.style.transform = `translateX(${index * 100}%)`
        })
      })
    })
  }

  prevSlide() {
    if (this.state.currentSlide > 1) {
      console.log('Previous Slide')
      this.state.prevSlide = this.state.currentSlide
      this.state.currentSlide--
      this.state.direction = 'ltr'
      this.animateSlide()
      this.animateControls()
    }
  }

  nextSlide() {
    if (this.state.currentSlide < this.albums.length - 1) {
      console.log('Next Slide')
      this.state.prevSlide = this.state.currentSlide
      this.state.currentSlide++
      this.state.direction = 'rtl'
      this.animateSlide()
      this.animateControls()
    }
  }

  animateSlide() {
    // Reset previous
    if (this.state.currentSlide) {
      this.videos[this.state.prevSlide].pauseVideo()
      this.timelines[this.state.prevSlide].stopTimeline()

      if (typeof this.animations[this.state.prevSlide].stopAnimation === "function") {
        this.animations[this.state.prevSlide].stopAnimation()
      }
    }

    // Play timeline
    this.videos[this.state.currentSlide].playVideo()
    this.timelines[this.state.currentSlide].playTimeline()

    if (typeof this.animations[this.state.currentSlide].playAnimation === "function") {
      this.animations[this.state.currentSlide].playAnimation()
    }

    // Animate slide
    Array.from(this.dom.slideshows).map(slideshow => {
      slideshow.style.transform = `translateX(-${this.state.currentSlide * this.width}px)`
    })

    // Animate albums
    let prevAlbum = this.dom.slideshowAlbums.children[this.state.prevSlide].querySelector('.album__vinyl')
    let nextAlbum = this.dom.slideshowAlbums.children[this.state.currentSlide].querySelector('.album__vinyl')
    let slideRotation = (this.state.direction === 'rtl') ? -90 : 90

    prevAlbum ? prevAlbum.style.transform = `rotateY(${-slideRotation}deg)` : null
    nextAlbum ? nextAlbum.style.transform = `rotateY(${-15}deg)` : null
  }

  animateControls() {
    // Show/Hide controls
    if (this.state.currentSlide === this.albums.length - 1) {
      this.dom.controlNext.classList.remove('playlist__control--visible')
    }

    else if (this.state.currentSlide > 1) {
      this.dom.controlNext.classList.add('playlist__control--visible')
      this.dom.controlPrev.classList.add('playlist__control--visible')
    }

    else if (this.state.currentSlide) {
      this.dom.controlNext.classList.add('playlist__control--visible')
      this.dom.controlPrev.classList.remove('playlist__control--visible')
    }

    else {
      this.dom.controlNext.classList.remove('playlist__control--visible')
      this.dom.controlPrev.classList.remove('playlist__control--visible')
    }
  }

  // Animations
  animateProgress() {
    setTimeout(() => {
      requestAnimationFrame(this.animateProgress.bind(this))
      this.dom.indicator.style.width = `${this.timelines[this.state.currentSlide].getProgress()}%`
    }, 1000/60)
  }

  // Mounting
  componentDidMount() {
    // Update Dom
    this.dom.slideshows = document.querySelectorAll('.playlist__slideshow')

    this.dom.slideshowVideos = document.querySelector('.playlist__slideshow--videos')
    this.dom.slideshowAlbums = document.querySelector('.playlist__slideshow--albums')
    this.dom.slideshowAnimations = document.querySelector('.playlist__slideshow--animations')

    this.dom.controlNext = document.querySelector('.playlist__control--next')
    this.dom.controlPrev = document.querySelector('.playlist__control--prev')
    this.dom.indicator = document.querySelector('.playlist__progress__indicator')
    this.dom.controlPlay = document.querySelector('.playlist__play')

    // Create videos and timelines
    this.setVideos()
    this.setTimelines()

    // Events
    this.handleClick()
    this.handleKeypress()
    this.handleResize()
    this.handleReady()

    // Animate progress
    this.animateProgress()
  }

  render() {
    let videoSlides = this.playlist.map((slide, index) => {
      return (`
        <div class="playlist__slide" style="transform: translateX(${index * 100}%); width: ${this.width}px; height: ${this.height}px;">
          <div class="video video-${slide.youtubeID}"></div>
        </div>
      `)
    }).join('')

    let albumSlides = this.playlist.map((slide, index) => {
      let album = index ? this.albums[index].render() : null

      return (`
        <div class="playlist__slide" style="transform: translateX(${index * 100}%); width: ${this.width}px; height: ${this.height}px;">
          ${album}
        </div>
      `)
    }).join('')

    let animationSlides = this.playlist.map((slide, index) => {
      let animation = this.animations[index].render()

      return (`
        <div class="playlist__slide" style="transform: translateX(${index * 100}%); width: ${this.width}px; height: ${this.height}px;">
          ${animation}
        </div>
      `)
    }).join('')

    this.app.innerHTML = `
      <!-- Playlist --!>
      <div class="playlist">
        <div class="playlist__slideshow playlist__slideshow--videos" style="width: ${this.width * (this.albums.length)}px; height: ${this.height}px;">
          ${videoSlides}
        </div>

        <div class="playlist__slideshow playlist__slideshow--albums" style="width: ${this.width * (this.albums.length)}px; height: ${this.height}px;">
          ${albumSlides}
        </div>

        <div class="playlist__slideshow playlist__slideshow--animations" style="width: ${this.width * (this.albums.length)}px; height: ${this.height}px;">
          ${animationSlides}
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

    this.animations.map((animation, index) => {
      animation.componentDidMount()
    })

    return this.componentDidMount()
  }
}
