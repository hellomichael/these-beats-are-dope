require('../scss/_playlist.scss')

export default class Playlist {
  constructor(options) {
    this.width = window.innerWidth
    this.height = window.innerHeight
    Object.assign(this, options)

    this.state = {
      prevSlide: 0,
      currentSlide: 0
    }

    this.handleClick()
    this.handleResize()
  }

  handleClick () {
    // Controls
    document.querySelector('#app').addEventListener('click', (event) => {
      event.preventDefault()

      if (event.target.matches('.playlist__control--next')) {
        if (this.state.currentSlide < this.albums.length - 1) {
          this.state.currentSlide++
        }
      }

      else if (event.target.matches('.playlist__control--prev')) {
        if (this.state.currentSlide > 0) {
          this.state.currentSlide--
        }
      }

      document.querySelector('.playlist__slideshow').style.transform = `translateX(-${this.state.currentSlide * this.width}px)`
    })
  }

  handleResize() {
    // Resizing
    window.addEventListener('resize', (event) => {
      this.width = window.innerWidth
      this.height = window.innerHeight

      // Update slideshow
      document.querySelector('.playlist__slideshow').style.transform = `translateX(-${this.state.currentSlide * this.width}px)`

      // Update slide
      Array.from(document.querySelectorAll('.playlist__slide')).map((slide, index) => {
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
