import Animation from './Animation'
require('../scss/_aziz.scss')

export default class Aziz extends Animation {
  constructor(options) {
    super()
    Object.assign(this, options)
  }

  componentDidMount() {
    this.dom = {
      azizQuote:            document.querySelector('.aziz__quote'),
      azizHeartbreak:       document.querySelector('.aziz__highlight--heartbreak'),
      azizBoom:             document.querySelector('.aziz__highlight--boom'),
      azizBobbing:          document.querySelector('.aziz__highlight--bobbing'),
      azizThese:            document.querySelector('.aziz__heading__these'),
      azizBeats:            document.querySelector('.aziz__heading__beats'),
      azizAre:              document.querySelector('.aziz__heading__are'),
      azizDope:             document.querySelector('.aziz__heading__dope'),
      azizSubheading:       document.querySelector('.aziz__subheading'),
      azizButton:           document.querySelector('.aziz__button'),
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

  showIntro() {
    this.dom.azizSubheading.style.display = 'block'
    this.dom.azizButton.style.display = 'inline-block'
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
          <a class="playlist__play aziz__button" href="#">
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
