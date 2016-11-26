import * as Utils from './Utils.js'
require('../scss/_animation.scss')

export default class Animation {
  constructor(options) {
    this.id = null
    this.element = null
    this.animation = null
    this.width = 1884
    this.height = 1937
    this.scale = 1
    this.bopCount = 0
    this.requestAnimationFrame = null
    Object.assign(this, options)

    // Events
    this.handleResize()
  }

  scaleRenderer() {
    this.scale = Utils.getTwoDecimalPlaces((window.innerHeight + 20)/this.height)
    this.renderer.view.style.transform = `scale(${this.scale}) translateX(-50%)`
  }

  handleResize() {
    window.addEventListener('resize', event => {
      this.scaleRenderer()
    })
  }

  componentDidMount() {
    this.element = document.querySelector(`.animation-${this.id}`)

    // Create renderer
    this.renderer = PIXI.autoDetectRenderer(this.width + 10, this.height, {transparent: true})
    this.element.appendChild(this.renderer.view)
    this.stage = new PIXI.Container()

    // Scale renderer
    this.scaleRenderer()

    // Add assets
    PIXI.loader
      .add(`animation-${this.id}`, 'img/kanye.json')
      .load((loader, res) => {
        this.kanye = new PIXI.spine.Spine(res[`animation-${this.id}`].spineData)

        // set the position
        this.kanye.position.x = this.renderer.width/2
        this.kanye.position.y = this.renderer.height

        this.stage.addChild(this.kanye)
      })
  }

  stopAnimation() {
    setTimeout(() => {
      cancelAnimationFrame(this.requestAnimationFrame)
      clearTimeout(this.animation)
      this.resetBopCount()
    }, 250)
  }

  playAnimation() {
    this.animation = setTimeout(() => {
      this.requestAnimationFrame = requestAnimationFrame(this.playAnimation.bind(this))
      this.renderer.render(this.stage)
    }, 1000/60)
  }

  resetBopCount() {
    this.bopCount = 0
  }

  breathing() {
    console.log('Breathing')
    this.kanye.state.setAnimation(0, 'breathing', true)
  }

  bop() {
    console.log('Bop')
    this.kanye.state.setAnimation(0, 'bop', false)

    if (this.bopCount%12 === 0) {
      this.blink()
    }

    this.bopCount++
  }

  bopAngled() {
    if (this.bopCount%12 === 0) {
      this.blink()
    }

    if (this.bopCount%2 === 0) {
      this.kanye.state.setAnimation(0, 'bopLeft', false)
    }

    else {
      this.kanye.state.setAnimation(0, 'bopRight', false)
    }

    this.bopCount++
  }

  bopLeft() {
    console.log('Bop Left')
    this.kanye.state.setAnimation(0, 'bopLeft', false)
  }

  bopRight() {
    console.log('Bop Right')
    this.kanye.state.setAnimation(0, 'bopRight', false)
  }

  blink() {
    console.log('Blink')
    this.kanye.state.setAnimation(1, 'blink', false)
  }

  closeEyes() {
    console.log('Close Eyes')
    this.kanye.state.setAnimation(1, 'closeEyes', false)
  }

  openEyes() {
    console.log('Open Eyes')
    this.kanye.state.setAnimation(1, 'openEyes', false)
  }

  shiver() {
    console.log('Shiver')
    this.kanye.state.setAnimation(1, 'shiver', false)
  }

  render() {
    return (`
      <div class="animation animation-${this.id}"></div>
    `)

    return this.componentDidMount()
  }
}
