import Pixi from 'pixi.js'
require('../scss/_kanye.scss')

export default class Kanye {
  constructor(options) {
    this.id = null
    this.element = null
    this.animation = null
    this.requestAnimationFrame = null
    Object.assign(this, options)
  }

  componentDidMount() {
    this.element = document.querySelector(`.kanye-${this.id}`)

    // Create renderer
    this.renderer = PIXI.autoDetectRenderer(942, 969, {transparent: true})
    this.element.appendChild(this.renderer.view)
    this.stage = new PIXI.Container()

    // Add assets
    let texture = PIXI.Texture.fromImage('./img/@2x/kanye.png')
    let kanye = new PIXI.Sprite(texture)

    kanye.position.x = 0;
    kanye.position.y = 0;

    this.stage.addChild(kanye)

    this.playAnimation()
  }

  stopAnimation() {
    cancelAnimationFrame(this.requestAnimationFrame)
    clearTimeout(this.animation)
  }

  playAnimation() {
    this.animation = setTimeout(() => {
      this.requestAnimationFrame = requestAnimationFrame(this.playAnimation.bind(this))
      this.renderer.render(this.stage)
    }, 1000/60)
  }

  render() {
    return (`
      <div class="kanye kanye-${this.id}"></div>
    `)

    return this.componentDidMount()
  }
}
