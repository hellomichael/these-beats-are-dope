import Animation from './Animation'
import * as Utils from './Utils.js'
require('../scss/_kanye.scss')

export default class Kanye extends Animation {
  constructor(options) {
    super()

    this.pixiStage = null
    this.pixiLoader = null
    this.pixiRenderer = null
    this.pixiScale = 1
    this.pixiAnimation = null
    this.requestAnimationFrame = null

    this.kanyeWidth = 1884
    this.kanyeHeight = 1937
    this.kanyeBopCount = 0

    Object.assign(this, options)

    // Events
    this.handleResize()
  }

  handleResize() {
    window.addEventListener('resize', event => {
      this.resizeRenderer()
    })
  }

  resizeRenderer() {
    this.pixiScale = Utils.getTwoDecimalPlaces((window.innerHeight + 20)/this.kanyeHeight)
    this.pixiRenderer.view.style.transform = `scale(${this.pixiScale}) translateX(-50%)`
  }

  isReady() {
    return new Promise((resolve, reject) => {
      this.pixiLoader.once('complete', event => {
        resolve(event)
      })
    })
  }

  componentDidMount() {
    this.element = document.querySelector(`.kanye-${this.id}`)

    // Create renderer
    this.pixiStage = new PIXI.Container()
    this.pixiRenderer = PIXI.autoDetectRenderer(this.kanyeWidth + 10, this.kanyeHeight, {transparent: true})
    this.element.appendChild(this.pixiRenderer.view)

    // Resize renderer
    this.resizeRenderer()

    // Add assets
    this.pixiLoader = PIXI.loader
      .add(`kanye-${this.id}`, 'img/kanye.json')
      .load((loader, res) => {
        this.kanye = new PIXI.spine.Spine(res[`kanye-${this.id}`].spineData)
        this.kanye.position.x = this.kanyeWidth/2
        this.kanye.position.y = this.kanyeHeight
        this.pixiStage.addChild(this.kanye)
      })
  }

  stopAnimation() {
    setTimeout(() => {
      this.kanyeBopCount = 0
      cancelAnimationFrame(this.requestAnimationFrame)
      clearTimeout(this.pixiAnimation)
    }, 250)
  }

  playAnimation() {
    this.pixiAnimation = setTimeout(() => {
      this.requestAnimationFrame = requestAnimationFrame(this.playAnimation.bind(this))
      this.pixiRenderer.render(this.pixiStage)
    }, 1000/60)
  }

  breathing() {
    console.log('Breathing')
    this.kanye.state.setAnimation(0, 'breathing', true)
  }

  bop() {
    console.log('Bop')
    this.kanye.state.setAnimation(0, 'bop', false)

    if (this.kanyeBopCount%12 === 0) {
      this.blink()
    }

    this.kanyeBopCount++
  }

  bopAngle() {
    console.log('Bop Angle')
    if (this.kanyeBopCount%12 === 0) {
      this.blink()
    }

    if (this.kanyeBopCount%2 === 0) {
      this.kanye.state.setAnimation(0, 'bopLeft', false)
    }

    else {
      this.kanye.state.setAnimation(0, 'bopRight', false)
    }

    this.kanyeBopCount++
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
      <div class="kanye kanye-${this.id}"></div>
    `)

    return this.componentDidMount()
  }
}
