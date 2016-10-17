require('../scss/_kanye.scss')

export default class Kanye {
  constructor(options) {
    Object.assign(this, options)
  }

  render() {
    return (`
      <div class="kanye">

      </div>
    `)
  }
}
