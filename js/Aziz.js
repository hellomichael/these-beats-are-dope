import Animation from './Animation'
require('../scss/_aziz.scss')

export default class Aziz extends Animation {
  constructor(options) {
    super()
    Object.assign(this, options)
  }

  componentDidMount() {
    this.dom = {
      azizIntro:            document.querySelector('.aziz__intro'),
      azizThese:            document.querySelector('.aziz__heading__these'),
      azizBeats:            document.querySelector('.aziz__heading__beats'),
      azizAre:              document.querySelector('.aziz__heading__are'),
      azizDope:             document.querySelector('.aziz__heading__dope'),
      azizSubheading:       document.querySelector('.aziz__subheading'),
      azizButton:           document.querySelector('.aziz__button'),
    }

    if (window.innerWidth < 768) {
      this.showThese()
      this.showBeats()
      this.showAre()
      this.showDope()
      this.showIntro()
    }
  }

  showThese() {
    console.log('These')
    this.dom.azizThese.style.display = 'inline-block'
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

  showButton() {
    this.dom.azizButton.classList.add('aziz__button--visible')
  }

  scrollIntro1() {
    this.dom.azizIntro.classList.add('aziz__intro--scroll-1')
  }

  scrollIntro2() {
    this.dom.azizIntro.classList.add('aziz__intro--scroll-2')
  }

  render() {
    return (`
      <div class="aziz aziz-${this.id}">
        <div class="aziz__intro">
          <h1 class="aziz__heading">
            <span class="aziz__heading__these">These</span>
            <span class="aziz__heading__beats">Beats</span>
            <span class="aziz__heading__are">Are</span>
            <span class="aziz__heading__dope">Dope</span>
          </h1>

          <h4 class="aziz__subheading">A Curated Mixtape For Kanye West</h4>

          <a class="aziz__button playlist__play" href="#">
            <span>
              Play Tracks
              <i class="icon icon--play"></i>
            </span>
          </a>
        </div>
      </div>
    `)
  }
}
