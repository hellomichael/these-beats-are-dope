import Animation from './Animation'
require('../scss/_aziz.scss')

export default class Aziz extends Animation {
  constructor(options) {
    super()
    this.mouseTimeout = null
    this.disableSkip = false
    Object.assign(this, options)
    this.setIdle()
  }

  componentDidMount() {
    this.dom = {
      aziz:                 document.querySelector('.aziz'),
      azizIntro:            document.querySelector('.aziz__intro'),
      azizThese:            document.querySelector('.aziz__heading__these'),
      azizBeats:            document.querySelector('.aziz__heading__beats'),
      azizAre:              document.querySelector('.aziz__heading__are'),
      azizDope:             document.querySelector('.aziz__heading__dope'),
      azizSubheading:       document.querySelector('.aziz__subheading'),
      azizStart:            document.querySelector('.aziz__start'),
      azizSkip:             document.querySelector('.aziz__skip'),
      preloader:            document.querySelector('.playlist__preloader')
    }

    this.handleMouseMove()
  }

  handleMouseMove() {
    this.dom.aziz.addEventListener('mousemove', event => {
      if (!this.disableSkip && !this.dom.preloader.classList.contains('playlist__preloader--visible')) {
        this.showSkip()
        this.setIdle()
      }

      else {
        clearTimeout(this.mouseTimeout)
      }
    })
  }

  setIdle() {
    clearTimeout(this.mouseTimeout)
    this.mouseTimeout = setTimeout(() => {this.hideSkip()}, 2000)
  }

  showIntro() {
    setTimeout(() => {
      this.showThese()
      this.showBeats()
      this.showAre()
      this.showDope()
      this.scrollIntro2()
    }, 25)

    setTimeout(() => {
      this.showSubheading()
    }, 75)

    setTimeout(() => {
      this.showStart()
    }, 125)
  }

  showThese() {
    console.log('These')
    this.dom.azizThese.style.display = 'inline-block'
    this.disableSkip = true
    this.hideSkip()
  }

  showBeats() {
    console.log('Beats')
    this.dom.azizBeats.style.display = 'inline-block'
  }

  showAre() {
    console.log('Are')
    this.dom.azizAre.style.display = 'inline-block'
  }

  showDope() {
    console.log('Dope')
    this.dom.azizDope.style.display = 'inline-block'
  }

  showSubheading() {
    this.dom.azizSubheading.classList.add('aziz__subheading--visible')
  }

  showStart() {
    this.dom.azizStart.classList.add('aziz__start--visible')
  }

  showSkip() {
    if (!this.dom.azizStart.classList.contains('aziz__start--visible')) {
      this.dom.azizSkip.classList.add('aziz__skip--visible')
    }
  }

  hideSkip() {
    this.dom.azizSkip.classList.remove('aziz__skip--visible')
  }

  scrollIntro1() {
    this.dom.azizIntro.classList.add('aziz__intro--scroll-1')
  }

  scrollIntro2() {
    this.dom.azizIntro.classList.add('aziz__intro--scroll-2')
  }

  render() {
    return (`
      <div class="aziz aziz--${this.id}">
        <div class="aziz__intro">
          <h1 class="aziz__heading mega">
            <span class="aziz__heading__these">These</span>
            <span class="aziz__heading__beats">Beats</span>
            <span class="aziz__heading__are">Are</span>
            <span class="aziz__heading__dope">Dope</span>
          </h1>

          <h4 class="aziz__subheading">A Curated Mixtape For Kanye West</h4>

          <a class="aziz__button aziz__start playlist__start" href="#">
            <span>
              Play Tracks
              <i class="icon icon--play"></i>
            </span>
          </a>
        </div>

        <a class="aziz__button aziz__skip playlist__skip playlist__start" href="#">
          <span>
            Skip intro
            <i class="icon icon--play"></i>
          </span>
        </a>
      </div>
    `)
  }
}
