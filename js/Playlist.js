import Album from './Album.js'
import Video from './Video.js'
import Timeline from './Timeline.js'
import Aziz from './Aziz.js'
import Kanye from './Kanye.js'
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
      indicator: null
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
    .then(() => {
      // Events
      this.handleClick()
      this.handleKeypress()
      this.handleResize()
      this.render()
    })
  }

  setAnimations() {
    this.playlist.map(slide => {
      let animation = new Aziz()

      if (slide.animation === 'Kanye') {
        animation = new Kanye()
      }

      this.animations.push(animation)
    })
  }

  setAlbums() {
    let promises = []

    this.playlist.map(album => {
      let promise = fetch(`https://api.spotify.com/v1/tracks/${album.spotifyID}`)
      .then(response => response.json())
      .then(data => {
        let album = new Album(data)
        this.albums.push(album)
      })

      promises.push(promise)
    })

    return Promise.all(promises)
  }

  setVideos() {
    this.playlist.map((slide, index) => {
      let video = new Video({
        id:             slide.youtubeID,
        element:        this.dom.slides[index].querySelector('.video')
      })

      this.videos.push(video)
    })
  }

  setTimelines() {
    this.playlist.map((slide, index) => {
      let timeline = new Timeline({
        id:             slide.youtubeID,
        setDuration:    this.videos[index].youtube.getDuration,
        setCurrentTime: this.videos[index].youtube.getCurrentTime,
        indicator:      this.dom.indicator
      })

      this.timelines.push(timeline)
    })
  }

  // Mounting
  componentDidMount() {
    // Update Dom
    this.dom.slideshow = document.querySelector('.playlist__slideshow')
    this.dom.slides = document.querySelectorAll('.playlist__slide')
    this.dom.indicator = document.querySelector('.playlist__progress__indicator')

    // Create videos and timelines
    this.setVideos()
    this.setTimelines()

    // Animate progress
    this.animateProgress()
  }

  // Controls
  handleClick() {
    this.app.addEventListener('click', event => {
      event.preventDefault()

      // Next
      if (event.target.matches('.playlist__control--next')) {
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
      if (event.keyCode === 37) {
        this.prevSlide()
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
      this.dom.slideshow.style.transform = `translateX(-${this.state.currentSlide * this.width}px)`

      // Update slide
      Array.from(this.dom.slides).map((slide, index) => {
        slide.style.width = `${this.width}px`
        slide.style.height = `${this.height}px`
        slide.style.transform = `translateX(${index * 100}%)`
      })
    })
  }

  prevSlide() {
    if (this.state.currentSlide > 0) {
      this.state.prevSlide = this.state.currentSlide
      this.state.currentSlide--
      this.state.direction = 'ltr'
      this.animateSlide()
    }
  }

  nextSlide() {
    if (this.state.currentSlide < this.albums.length - 1) {
      this.state.prevSlide = this.state.currentSlide
      this.state.currentSlide++
      this.state.direction = 'rtl'
      this.animateSlide()
    }
  }

  // Animations
  animateProgress() {
    setTimeout(() => {
      requestAnimationFrame(this.animateProgress.bind(this))
      this.dom.indicator.style.width = `${this.timelines[this.state.currentSlide].getProgress()}%`
    }, 1000/60)
  }

  animateSlide() {
    // Set local variables
    let slide = Array.from(this.dom.slideshow.children)[this.state.currentSlide]
    let slideContent  = slide.querySelector('.playlist__content')
    let slideChildren = slideContent ? slideContent.children : null
    let slideDistance = (this.state.direction === 'rtl') ? this.width/1.5 : -this.width/1.5
    let slideRotation = (this.state.direction === 'rtl') ? 225 : -225

    // Reset previous
    this.videos[this.state.prevSlide].pauseVideo()
    this.timelines[this.state.prevSlide].stopTimeline()

    // Reset timeline
    this.videos[this.state.currentSlide].playVideo()
    this.timelines[this.state.currentSlide].playTimeline()

    // Animate slide
    this.dom.slideshow.style.transform = `translateX(-${this.state.currentSlide * this.width}px)`

    // Animate slide children
    if (slideChildren) {
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
  }

  render() {
    let playlistSlides = this.playlist.map((slide, index) => {
      if (index) {
        return (`
          <div class="playlist__slide" style="transform: translateX(${index * 100}%); width: ${this.width}px; height: ${this.height}px;">
            <div class="video"></div>
            ${this.albums[index].render()}
            ${this.animations[index].render()}
          </div>
        `)
      }

      else {
        return (`
          <div class="playlist__slide" style="transform: translateX(${index * 100}%); width: ${this.width}px; height: ${this.height}px;">
            <div class="video"></div>
            ${this.animations[index].render()}
          </div>
        `)
      }

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
