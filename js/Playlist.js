require('../scss/_playlist.scss')

export default class Playlist {
  constructor(options) {
    this.width = window.innerWidth
    this.height = window.innerHeight
    Object.assign(this, options)
    this.state = {
      currentSlide: 0,
      direction:    null
    }

    this.handleClick()
    this.handleResize()
  }

  animateSlide () {
    let slideshow = document.querySelector('.playlist__slideshow')
    let slide = Array.from(slideshow.children)[this.state.currentSlide]
    let slideChildren = slide.querySelector('.playlist__content').children
    let slideDistance = (this.state.direction === 'rtl') ? this.width/2 : -this.width/2

    // Animate slide
    slideshow.style.transform = `translateX(-${this.state.currentSlide * this.width}px)`

    Array.from(slideChildren).map((child, index) => {
      // Reset position
      child.classList.add('no-transition');
      child.style.transform = `translateX(${slideDistance}px)`

      // Stagger animation
      setTimeout(()=>{
        child.classList.remove('no-transition');
        child.style.transform = `translateX(0)`
      }, 75 * index)
    })
  }

  handleClick () {
    // Controls
    this.app.addEventListener('click', (event) => {
      event.preventDefault()

      if (event.target.matches('.playlist__control--next')) {
        if (this.state.currentSlide < this.albums.length - 1) {
          this.state.currentSlide++
          this.state.direction = 'rtl'
          this.animateSlide()
        }
      }

      else if (event.target.matches('.playlist__control--prev')) {
        if (this.state.currentSlide > 0) {
          this.state.currentSlide--
          this.state.direction = 'ltr'
          this.animateSlide()
        }
      }
    })
  }

  handleResize() {
    // Resizing
    window.addEventListener('resize', (event) => {
      // Set local variables
      let slideshow = document.querySelector('.playlist__slideshow')
      let slides = document.querySelectorAll('.playlist__slide')

      // Update state
      this.width = window.innerWidth
      this.height = window.innerHeight

      // Update slideshow
      slideshow.style.transform = `translateX(-${this.state.currentSlide * this.width}px)`

      // Update slide
      Array.from(slides).map((slide, index) => {
        slide.style.width = `${this.width}px`
        slide.style.height = `${this.height}px`
        slide.style.transform = `translateX(${index * 100}%)`
      })
    })
  }

  render() {
    let albums = this.albums.map((album, index) => {
      return `
        <div class="playlist__slide" style="transform: translateX(${index * 100}%); width: ${this.width}px; height: ${this.height}px;">
          ${album.render()}
        </div>`
    }).join('')

    return `
      <!-- Playlist --!>
      <div class="playlist">
        <div class="playlist__slideshow" style="width: ${this.width * (this.albums.length)}px; height: ${this.height}px;">
          ${albums}
        </div>

        <div class="playlist__frame playlist__frame--top"></div>
        <div class="playlist__frame playlist__frame--right"></div>
        <div class="playlist__frame playlist__frame--bottom"></div>
        <div class="playlist__frame playlist__frame--left"></div>

        <div class="playlist__progress-bar"></div>
        <a href="#" class="playlist__control playlist__control--prev"></a>
        <a href="#" class="playlist__control playlist__control--next"></a>
      </div>
    `
  }
}
