require('../scss/_aziz.scss')

export default class Aziz {
  constructor(options) {
    Object.assign(this, options)
  }

  scroll() {
    
  }

  highlightHeartbreak() {
    this.dom.highlightHeartbreak.classList.add('aziz__highlight--highlighted')
  }

  highlightBoom() {
    this.dom.highlightBoom.classList.add('aziz__highlight--highlighted')
  }

  highlightBobbing() {
    this.dom.highlightBobbing.classList.add('aziz__highlight--highlighted')
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

  componentDidMount() {
    // Update Dom
    this.dom = {
      highlightHeartbreak:  document.querySelector('.aziz__highlight--heartbreak'),
      highlightBoom:        document.querySelector('.aziz__highlight--boom'),
      highlightBobbing:     document.querySelector('.aziz__highlight--bobbing')
    }
  }

  render() {
    return (`
      <div class="aziz">
        <h2 class="aziz__paragraph">I hear ${this.renderHighlight('heartbreak', '"808s and Heartbreak"')}, playing which is his album and I walk in and he's just sitting there in his living room.</h2>

        <h2 class="aziz__paragraph">just like bobbing his head like, <br/>${this.renderHighlight('boom', '"boom boom boom".')}</h2>

        <h2 class="aziz__paragraph">I was like.</h2>

        <h2 class="aziz__paragraph">"Hey Kanye. Are you sitting in your own house,
        ${this.renderHighlight('bobbing', 'bobbing your own head')}, to your own music".</h2>

        <h2 class="aziz__paragraph" style="margin: 0;">And he goes...</h2>
      </div>
    `)
  }
}
