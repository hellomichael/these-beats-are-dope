import * as Utils from './Utils.js'
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
    .then(() => {
      this.render()
    })
  }

  setAnimations() {
    this.playlist.map(slide => {
      this.animations.push(slide.animation === 'Aziz' ? new Aziz() : new Kanye())
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
        name:           this.albums[index].name,
        element:        this.dom.slides[index].querySelector('.video'),
        startSeconds:   Utils.getSeconds(slide.keyframes[0].timecode)
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
        animation:      this.animations[index],
        keyframes:      slide.keyframes
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
        console.log(this.timelines[this.state.currentSlide].getCurrentTime(true))
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
    console.log('Previous Slide')
    if (this.state.currentSlide > 1) {
      this.state.prevSlide = this.state.currentSlide
      this.state.currentSlide--
      this.state.direction = 'ltr'
      this.animateSlide()
      this.animateControls()
    }
  }

  nextSlide() {
    console.log('Next Slide')

    if (this.state.currentSlide < this.albums.length - 1) {
      this.state.prevSlide = this.state.currentSlide
      this.state.currentSlide++
      this.state.direction = 'rtl'
      this.animateSlide()
      this.animateControls()
    }
  }

  animateSlide() {
    // Set local variables
    let slide = Array.from(this.dom.slideshow.children)[this.state.currentSlide]
    let slideContent  = slide.querySelector('.playlist__content')
    let slideChildren = slideContent ? slideContent.children : null
    let slideDistance = (this.state.direction === 'rtl') ? this.width/1.5 : -this.width/1.5
    let slideRotation = (this.state.direction === 'rtl') ? 225 : -225

    // Reset previous
    if (this.state.currentSlide) {
      this.videos[this.state.prevSlide].pauseVideo()
      this.timelines[this.state.prevSlide].stopTimeline()
    }

    // Play timeline
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
    this.dom.slideshow = document.querySelector('.playlist__slideshow')
    this.dom.slides = document.querySelectorAll('.playlist__slide')
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
    let playlistSlides = this.playlist.map((slide, index) => {
      let album = index ? this.albums[index].render() : null
      let animation = this.animations[index].render()

      return (`
        <div class="playlist__slide" style="transform: translateX(${index * 100}%); width: ${this.width}px; height: ${this.height}px;">
          <div class="video"></div>
          ${album}
          ${animation}
        </div>
      `)

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

    this.animations.map((animation, index) => {
      animation.componentDidMount()
    })

    return this.componentDidMount()
  }
}
