// import Pixi from 'pixi.js'
// import Spine from 'pixi-spine'
require('../scss/_animation.scss')

export default class Animation {
  constructor(options) {
    this.id = null
    this.element = null
    this.animation = null
    this.requestAnimationFrame = null
    Object.assign(this, options)
  }

  componentDidMount() {
    this.element = document.querySelector(`.animation-${this.id}`)

    // Create renderer
    this.renderer = PIXI.autoDetectRenderer(942, 969, {transparent: true})
    this.element.appendChild(this.renderer.view)
    this.stage = new PIXI.Container()

    // Add assets
    PIXI.loader
      .add(`animation-${this.id}`, 'img/spineboy.json')
      .load((loader, res) => {
        this.spineBoy = new PIXI.spine.Spine(res[`animation-${this.id}`].spineData)

        // set the position
        this.spineBoy.position.x = this.renderer.width / 2;
        this.spineBoy.position.y = this.renderer.height;

        this.spineBoy.scale.set(1.5);

        // set up the mixes!
        this.spineBoy.stateData.setMixByName('walk', 'jump', 0.2);
        this.spineBoy.stateData.setMixByName('jump', 'walk', 0.4);

        // play animation
        this.spineBoy.state.setAnimationByName(0, 'walk', true);

        this.stage.addChild(this.spineBoy);
      })
  }

  stopAnimation() {
    setTimeout(() => {
      cancelAnimationFrame(this.requestAnimationFrame)
      clearTimeout(this.animation)
    }, 250)
  }

  playAnimation() {
    this.animation = setTimeout(() => {
      this.requestAnimationFrame = requestAnimationFrame(this.playAnimation.bind(this))
      this.renderer.render(this.stage)
    }, 1000/60)
  }

  render() {
    return (`
      <div class="animation animation-${this.id}"></div>
    `)

    return this.componentDidMount()
  }
}
