require('../scss/_aziz.scss')

export default class Aziz {
  constructor(options) {
    Object.assign(this, options)
  }

  render() {
    return (`
      <div class="aziz">
        <h2 class="aziz__paragraph">I hear <span class="aziz__highlight">"808s and Heartbreak"</span> playing which is his album and I walk in and he's just sitting there in his living room.</h2>

        <h2 class="aziz__paragraph">just like bobbing his head like, <br/>
        <span class="aziz__highlight">"boom boom boom".</span></h2>

        <h2 class="aziz__paragraph">I was like,</h2>

        <h2 class="aziz__paragraph">"Hey Kanye. Are you sitting in your own house, <span class="aziz__highlight">bobbing your own head</span>, to your own music".</h2>

        <h2 class="aziz__paragraph">And he goes...</h2>
      </div>
    `)
  }
}
