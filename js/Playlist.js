import 'whatwg-fetch'
import MobileDetect from 'mobile-detect'
import Hammer from 'hammerjs'
import Album from './Album.js'
import Video from './Video.js'
import Timeline from './Timeline.js'
import Aziz from './Aziz.js'
import Kanye from './Kanye.js'
import * as Utils from './Utils.js'
require('../scss/_playlist.scss')

export default class Playlist {
  constructor(options) {
    // Props
    this.device = new MobileDetect(window.navigator.userAgent)
    this.isMobile = false ? true : this.device.mobile()
    this.isPhone  = false ? true : this.device.phone()
    this.isTablet = false ? true : this.device.tablet()

    this.matchesPolyfill()

    this.app = null
    this.playlist = []
    this.albums = []
    this.videos = []
    this.timelines = []
    this.animations = []

    this.width = window.innerWidth
    this.height = window.innerHeight
    this.isTransitioning = false
    this.isZoom = true
    this.preloaded = 0
    Object.assign(this, options)

    // Only load first frame
    // this.playlist = this.playlist.slice(0,2)

    // Dom
    this.dom = {
      slideshow: null,
      slides: null,
      indicator: null,
      controls: null
    }

    // State
    this.state = {
      currentSlide:     0,
      prevSlide:        0,
      direction:        'rtl'
    }

    // Set data
    this.setAnimations()
    this.setAlbums()
    .then(albums => {
      this.albums = albums
      this.render()
    })
  }

  matchesPolyfill() {
    if (!Element.prototype.matches) {
      let ep = Element.prototype

      // Chrome <34, SF<7.1, iOS<8
      if (ep.webkitMatchesSelector) {
        ep.matches = ep.webkitMatchesSelector
      }

      // IE9/10/11 & Edge
      if (ep.msMatchesSelector) {
        ep.matches = ep.msMatchesSelector
      }

      // FF<34
      if (ep.mozMatchesSelector) {
        ep.matches = ep.mozMatchesSelector
      }
    }
  }

  setAnimations() {
    this.playlist.map(slide => {
      this.animations.push(slide.animation === 'Aziz' ? new Aziz({id: slide.youtubeID}) : new Kanye({id: slide.youtubeID, pixiAnimationMix: slide.animationMix}))
    })
  }

  setAlbums() {
    let promises = []

    this.playlist.map(slide => {
      let promise = fetch(`https://api.spotify.com/v1/tracks/${slide.spotifyID}`)
      .then(response => response.json())
      .then(data => {
        return new Album(Object.assign({
          isMobile:   this.isMobile,
          isPhone:    this.isPhone,
          isTablet:   this.isTablet,

          id:         slide.youtubeID,
          year:       slide.year
        }, data))
      })

      promises.push(promise)
    })

    return Promise.all(promises)
  }

  setVideos() {
    this.playlist.map((slide, index) => {
      let video = new Video({
        isMobile:   this.isMobile,
        isPhone:    this.isPhone,
        isTablet:   this.isTablet,

        id:             slide.youtubeID,
        name:           this.albums[index].name,
        element:        this.dom.slideshowVideos.children[index].querySelector('.video'),
        startTime:      Utils.getSeconds(slide.keyframes[0].timecode),
        endTime:        Utils.getSeconds(slide.keyframes[slide.keyframes.length - 1].timecode),
        volume:         slide.volume
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
        threshold:      slide.animationThreshold,
        nextSlide:      this.nextSlide.bind(this),
        isLoop:         (!(index)) ? true : false
      })

      this.timelines.push(timeline)
    })
  }

  setProgress() {
    this.dom.progress.classList.add('playlist__progress--visible')

    Array.from(this.dom.tracks).map(track => {
      track.style.width = `${this.width - 50}px`
    })
  }

  setFrames() {
    Array.from(this.dom.frames).map(frame => {
      frame.classList.add('playlist__frame--visible')
    })

    this.dom.social.classList.add('playlist__social--visible')
  }

  setPreloader() {
    this.dom.preloader.classList.add('playlist__preloader--visible')
  }

  // Preloader
  preload(progress) {
    return new Promise((resolve, reject) => {
      let speed = (progress === 100) ? Math.round((100 - this.preloaded)/15) : 1

      let counter = setInterval(() => {
        if (this.preloaded >= 100 && progress === 100) {
          this.dom.preloaderPercentage.innerText = `One hundred`
          this.dom.preloader.classList.remove('playlist__preloader--visible')

          clearInterval(counter)

          // Wait until intro ready
          setTimeout(() => {
            resolve()
          }, 2000)
        }

        else if (this.preloaded >= progress) {
          this.preloaded += speed
          clearInterval(counter)
          resolve()
        }

        else {
          this.dom.preloaderPercentage.innerText = `${Utils.getWordNumber(this.preloaded)}`
          this.preloaded += speed
        }
      }, 50)
    })
  }

  // Ready
  handleReady() {
    let animationPromises = []
    let videoPromises = []
    this.preload(88)

    // Preload all animations
    // this.animations.map((animation, index) => {
    //   animationPromises.push(animation.isReady())
    // })

    // Preload all videos
    // this.videos.map(video => {
    //   promises.push(video.isReady())
    // })

    animationPromises.push(this.animations[1].isReady())
    videoPromises.push(this.videos[0].isReady())

    Promise.all(videoPromises)
    .then(() => {
      Promise.all(animationPromises)
      .then(() => {
        this.animateSlide()
        this.animateProgress()

        this.preload(100)
        .then(() => {
          if (this.isMobile || window.innerWidth < 992) {
            // Show intro immediately for mobile
            this.animations[0].showIntro()
          }

          else {
            // Reset animations
            this.animations.map(animation => {
              animation.resetAnimation()
            })
          }

          // Add events
          this.handleClick()
          this.handleSwipe()
          this.handleKeypress()
        })
      })
    })
  }

  // Controls
  handleClick() {
    this.app.addEventListener('click', event => {
      // Next
      if (event.target.matches('.playlist__control--next, .playlist__control--next *, .playlist__start, .playlist__start *')) {
        event.preventDefault()
        this.nextSlide()
      }

      // Previous
      else if (event.target.matches('.playlist__control--prev, .playlist__control--prev *')) {
        event.preventDefault()
        this.prevSlide()
      }

      else if (event.target.matches('.playlist__control--play, .playlist__control--play *, .album, .album *')) {
        event.preventDefault()
        this.videos[this.state.currentSlide].playVideo()

        Array.from(this.dom.controlPlay).map(controlPlay => {
          controlPlay.classList.remove('playlist__control--visible')
        })
      }

      // Mute
      else if (event.target.matches('.playlist__social__icon--mute')) {
        this.videos.map(video => {
          event.preventDefault()
          video.muteVideo()
        })
      }

      else if (event.target.matches('.playlist__close')) {
        event.preventDefault()
        this.zoomIn()
      }
    })
  }

  handleSwipe() {
    let manager = new Hammer.Manager(this.dom.playlist)
    let swipe = new Hammer.Swipe({
      direction: Hammer.DIRECTION_HORIZONTAL
    })

    this.dom.playlist.style['touch-action'] = 'manipulation'

    manager.add(swipe)

    manager.on('swipeleft', () => {
      // this.nextSlide()
      this.dom.controlNext.click()
    })

    manager.on('swiperight', () => {
      // this.prevSlide()
      this.dom.controlPrev.click()
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

      // Zoom Out (Down)
      else if (event.keyCode === 40) {
        this.zoomOut()
      }

      // Zoom In (Up)
      else if (event.keyCode === 38 || event.keyCode === 27) {
        this.zoomIn()
      }
    })
  }

  // Resizing
  handleResize() {
    window.addEventListener('resize', () => {
      // Update state
      this.width = window.innerWidth
      this.height = window.innerHeight

      // Update track
      this.setProgress()

      // Update slides
      Array.from(this.dom.slideshows).map(slideshow => {
        // Update animation, albums, video
        slideshow.style.transform = `translateX(-${this.state.currentSlide * this.width}px)`
        slideshow.style.width = `${this.width * (this.albums.length)}px`
        slideshow.style.height = `${this.height}px`

        // Update slides
        Array.from(slideshow.children).map((slide, index) => {
          slide.style.width = `${this.width}px`
          slide.style.height = `${this.height}px`
          slide.style.transform = `translateX(${index * 100}%)`
        })
      })
    })
  }

  zoomOut() {
    if (this.isZoom) {
      console.log('Zoom out')

      this.isZoom = !this.isZoom
      this.dom.playlist.classList.add('playlist--zoom-out')
      this.dom.overlay.classList.add('playlist__overlay--visible')
      this.dom.about.classList.add('playlist__about--visible')
      this.dom.close.classList.add('playlist__close--visible')
    }
  }

  zoomIn() {
    if (!this.isZoom) {
      console.log('Zoom in')

      this.isZoom = !this.isZoom
      this.dom.playlist.classList.remove('playlist--zoom-out')
      this.dom.overlay.classList.remove('playlist__overlay--visible')
      this.dom.about.classList.remove('playlist__about--visible')
      this.dom.close.classList.remove('playlist__close--visible')
    }
  }

  prevSlide() {
    if (this.state.currentSlide > 0 && !this.isTransitioning) {
      console.log('Previous Slide')

      this.state.prevSlide = this.state.currentSlide
      this.state.currentSlide--
      this.state.direction = 'ltr'
      this.animateSlide()
      this.animateControls()
    }
  }

  nextSlide() {
    if ((this.state.currentSlide < this.albums.length - 1) && !this.isTransitioning) {
      console.log('Next Slide')

      this.state.prevSlide = this.state.currentSlide
      this.state.currentSlide++
      this.state.direction = 'rtl'
      this.animateSlide()
      this.animateControls()
    }

    else if (!this.isTransitioning) {
      this.zoomOut()
    }
  }

  animateSlide() {
    console.log('Animate Slide')

    // Reset previous video, timeline, and animations
    if (this.state.currentSlide || this.state.prevSlide) {
      this.isTransitioning = true

      this.animations[this.state.prevSlide].stopAnimation()
      this.videos[this.state.prevSlide].pauseVideo()
      .then(() => {
        this.timelines[this.state.prevSlide].resetTimeline()
        this.timelines[this.state.prevSlide].stopTimeline()
        this.isTransitioning = false

        // Optimize # of DOM elements on the screen
        Array.from(this.dom.slideshows).map(slideshow => {
          Array.from(slideshow.querySelectorAll('.playlist__slide')).map((slide, index) => {
            if (!this.isZoom) {
              slide.style.display = 'block'
            }

            else {
              if (index != this.state.currentSlide && index != (this.state.currentSlide + 1) && index != (this.state.currentSlide - 1)) {
                slide.style.display = 'none'
              }

              else {
                slide.style.display = 'block'
              }
            }
          })
        })
      })
    }

    // Play video, timeline, and animations
    this.videos[this.state.currentSlide].prefetchVideo()
    this.timelines[this.state.currentSlide].playTimeline()
    this.animations[this.state.currentSlide].playAnimation()

    if (!this.isMobile) {
      this.videos[this.state.currentSlide].playVideo()
    }

    // Animate slide
    Array.from(this.dom.slideshows).map(slideshow => {
      slideshow.style.transform = `translateX(-${this.state.currentSlide * this.width}px)`
    })

    // Animate albums
    let prevAlbum = this.dom.slideshowAlbums.children[this.state.prevSlide].querySelector('.album__vinyl')
    let nextAlbum = this.dom.slideshowAlbums.children[this.state.currentSlide].querySelector('.album__vinyl')
    let slideRotation = (this.state.direction === 'rtl') ? -75 : 75

    prevAlbum ? prevAlbum.style.transform = `rotateY(${-slideRotation}deg)` : null
    nextAlbum ? nextAlbum.style.transform = `rotateY(${-15}deg)` : null
  }

  animateControls() {
    // Show/Hide controls
    if (this.state.currentSlide) {
      if (this.isMobile) {
        Array.from(this.dom.controlPlay).map(controlPlay => {
          controlPlay.classList.add('playlist__control--visible')
        })

        this.dom.slideshowAlbums.style.zIndex = 4
      }

      else {
        this.dom.controlNext.classList.add('playlist__control--visible')
        this.dom.controlPrev.classList.add('playlist__control--visible')
      }
    }

    else {
      this.dom.controlNext.classList.remove('playlist__control--visible')
      this.dom.controlPrev.classList.remove('playlist__control--visible')
      this.dom.slideshowAlbums.style.zIndex = 2

      if (this.isMobile) {
        Array.from(this.dom.controlPlay).map(controlPlay => {
          controlPlay.classList.remove('playlist__control--visible')
        })
      }
    }
  }

  // Animations
  animateProgress() {
    setTimeout(() => {
      requestAnimationFrame(this.animateProgress.bind(this))
      let progress = this.timelines[this.state.currentSlide].getProgress()

      if (this.isTransitioning) {
        this.dom.indicator.classList.add('playlist__progress__indicator--reset')
      }

      else {
        this.dom.indicator.classList.remove('playlist__progress__indicator--reset')
      }

      this.dom.indicator.style.width = `${progress}%`
    }, 1000/60)
  }

  // Mounting
  componentDidMount() {
    // Update Dom
    this.dom.playlist = document.querySelector('.playlist')
    this.dom.slideshows = document.querySelectorAll('.playlist__slideshow')

    this.dom.slideshowVideos = document.querySelector('.playlist__slideshow--videos')
    this.dom.slideshowAlbums = document.querySelector('.playlist__slideshow--albums')
    this.dom.slideshowAnimations = document.querySelector('.playlist__slideshow--animations')

    this.dom.controlNext = document.querySelector('.playlist__control--next')
    this.dom.controlPrev = document.querySelector('.playlist__control--prev')
    this.dom.controlPlay = document.querySelectorAll('.playlist__control--play')

    this.dom.frames = document.querySelectorAll('.playlist__frame')
    this.dom.preloader = document.querySelector('.playlist__preloader')
    this.dom.preloaderPercentage = document.querySelector('.playlist__preloader__percentage')
    this.dom.social = document.querySelector('.playlist__social')
    this.dom.progress = document.querySelector('.playlist__progress')
    this.dom.tracks = document.querySelectorAll('.playlist__progress__track')
    this.dom.indicator = document.querySelector('.playlist__progress__indicator')

    this.dom.overlay = document.querySelector('.playlist__overlay')
    this.dom.about = document.querySelector('.playlist__about')
    this.dom.close = document.querySelector('.playlist__close')

    // Show preloader
    setTimeout(() => {
      this.setFrames()
      this.setProgress()
      this.setPreloader()
    }, 0)

    // Create videos and timelines
    this.setVideos()
    this.setTimelines()

    // Events
    this.handleResize()
    this.handleReady()
  }

  render() {
    let videoSlides = this.playlist.map((slide, index) => {
      return (`
        <div class="playlist__slide" style="transform: translateX(${index * 100}%); width: ${this.width}px; height: ${this.height}px;">
          <div class="video video--${slide.youtubeID}"></div>
        </div>
      `)
    }).join('')

    let albumSlides = this.playlist.map((slide, index) => {
      let album = index ? this.albums[index].render() : ''

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
        <div class="playlist__slideshow playlist__slideshow--animations" style="width: ${this.width * (this.albums.length)}px; height: ${this.height}px;">
          ${animationSlides}
        </div>

        <div class="playlist__slideshow playlist__slideshow--albums" style="width: ${this.width * (this.albums.length)}px; height: ${this.height}px;">
          ${albumSlides}
        </div>

        <div class="playlist__slideshow playlist__slideshow--videos" style="width: ${this.width * (this.albums.length)}px; height: ${this.height}px;">
          ${videoSlides}
        </div>

        <div class="playlist__progress">
          <div class="playlist__progress__track"></div>

          <div class="playlist__progress__indicator">
            <div class="playlist__progress__track"></div>
          </div>
        </div>

        <a href="#" class="playlist__control playlist__control--prev"><i class="icon icon--lg icon--arrow"></i></a>
        <a href="#" class="playlist__control playlist__control--next"><i class="icon icon--lg icon--arrow"></i></a>
        <a href="#" class="playlist__control playlist__control--play"><i class="icon icon--lg icon--play"></i></a>

        <div class="playlist__frame playlist__frame--top"></div>
        <div class="playlist__frame playlist__frame--right"></div>
        <div class="playlist__frame playlist__frame--bottom"></div>
        <div class="playlist__frame playlist__frame--left"></div>

        <div class="playlist__preloader">
          <h3 class="playlist__preloader__percentage"></h3>
          <i class="playlist__preloader__icon icon" alt=""></i>
        </div>

        <div class="playlist__social">
          <a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=these.beatsaredope.com" class="playlist__social__icon--facebook playlist__social__icon icon" alt=""></a>
          <a target="_blank" href="https://twitter.com/intent/tweet?text=%23thesebeatsaredope%20%23silversurfer%20%23wavy%20%40kanyewest%20%40azizansari" class="playlist__social__icon--twitter playlist__social__icon icon" alt=""></a>
          <a href="#" class="playlist__social__icon--mute playlist__social__icon icon" alt=""></a>

          <h6 class="playlist__social__hashtag"><a target="_blank" href="https://twitter.com/intent/tweet?text=%23thesebeatsaredope%20%23silversurfer%20%23wavy%20%40kanyewest%20%40azizansari">#thesebeatsaredope</a></h6>
          <small class="playlist__social__credits"><a target="_blank" href="http://anumation.ca/">Anu Chouhan</a> x <a target="_blank" href="https://hellomichael.com">Michael Ngo</a></small>
        </div>
      </div>

      <div class="playlist__about">
        <h4>People always say that you can't please everybody. I think that's a cop-out. <br/> Why not attempt it? 'Cause think of all the people you will please if you try.</h4>
        <h5>- Kanye West</h5>
      </div>

      <div class="playlist__overlay"></div>
      <a href="#" class="playlist__close icon icon--lg"></a>
    `

    this.animations.map(animation => {
      animation.componentDidMount()
    })

    this.albums.map(album => {
      album.componentDidMount()
    })

    this.componentDidMount()
  }
}
