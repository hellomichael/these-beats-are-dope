require('../scss/_aziz.scss')

export default class Aziz {
  constructor(options) {
    Object.assign(this, options)
  }

  // scrollQuote() {
  //   this.dom.azizQuote.classList.add('aziz__quote--scrolling')
  // }
  //
  // highlightHeartbreak() {
  //   this.dom.azizHeartbreak.classList.add('aziz__highlight--highlighted')
  // }
  //
  // highlightBoom() {
  //   this.dom.azizBoom.classList.add('aziz__highlight--highlighted')
  // }
  //
  // highlightBobbing() {
  //   this.dom.azizBobbing.classList.add('aziz__highlight--highlighted')
  // }

  showThese() {
    this.dom.azizThese.style.display = 'inline-block'
  }

  showBeats() {
    this.dom.azizBeats.style.display = 'inline-block'
  }

  showAre() {
    this.dom.azizAre.style.display = 'inline-block'
  }

  showDope() {
    this.dom.azizDope.style.display = 'inline-block'
  }

  showIntro() {
    this.dom.azizSubheading.style.opacity = 1
    this.dom.azizButton.style.opacity = 1
  }

  componentDidMount() {
    // Update Dom
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

  renderHighlight(className, copy) {
    return (
      `<span class="aziz__highlight aziz__highlight--${className}">
        <span class="aziz__highlight__copy">${copy}</span>
        <span class="aziz__highlight__mask">${copy}</span>
        <img class="aziz__highlight__stroke" src="../img/aziz-highlight.png" alt=""/>
      </span>`
    )
  }

  render() {
    return (`
      <div class="aziz">
        <!-- <div class="aziz__quote">
          <h2 class="aziz__paragraph">I hear ${this.renderHighlight('heartbreak', '"808s and Heartbreak"')}, playing which is his album and I walk in and he's just sitting there in his living room.</h2>

          <h2 class="aziz__paragraph">just like bobbing his head like, <br/>${this.renderHighlight('boom', '"boom boom boom".')}</h2>

          <h2 class="aziz__paragraph">I was like.</h2>

          <h2 class="aziz__paragraph">"Hey Kanye. Are you sitting in your own house,
          ${this.renderHighlight('bobbing', 'bobbing your own head')}, to your own music".</h2>

          <h2 class="aziz__paragraph" style="margin: 0;">And he goes...</h2>
        </div> -->

        <div class="aziz__intro">
          <h1 class="aziz__heading">
            <span class="aziz__heading__these">These</span>
            <span class="aziz__heading__beats">Beats</span>
            <span class="aziz__heading__are">Are</span>
            <span class="aziz__heading__dope">Dope</span>
          </h1>

          <h4 class="aziz__subheading">A Curated Playlist For Kanye West</h4>
          <a class="playlist__play aziz__button" href="#">Begin Playlist <i class="icon icon--play"></i></a>
        </div>
      </div>
    `)
  }
}
