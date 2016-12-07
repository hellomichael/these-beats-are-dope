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
    this.pixiResolution = Utils.isHighDensity() ? 1 : 1.5
    this.pixiAnimation = null
    this.pixiAnimationMix = 0
    this.requestAnimationFrame = null

    this.kanyeWidth = Utils.isHighDensity() ? 1884 : 1884/this.pixiResolution
    this.kanyeHeight = Utils.isHighDensity() ? 1937 : 1937/this.pixiResolution

    this.kanyeEyesOpen = false
    this.kanyeDirection = 'left'
    this.kanyeBopCount = 0
    this.kanyeIdle = false
    this.mouseDirection = null
    this.mouseTimeout = null

    Object.assign(this, options)

    this.setIdle()
  }

  handleMouseMove() {
    window.addEventListener('mousemove', event => {
      if (this.isPlaying) {
        this.kanyeIdle = false
        this.setDirection(event.clientX)
        this.setIdle()
      }
    })
  }

  handleResize() {
    window.addEventListener('resize', event => {
      this.resizeRenderer()
    })
  }

  setIdle() {
    clearTimeout(this.mouseTimeout)
    this.mouseTimeout = setTimeout(() => {this.kanyeIdle = true}, 3000)
  }

  setDirection(mousePosition) {
    if (!this.kanyeIdle) {
      let bounds = this.element.querySelector('canvas').getBoundingClientRect()
      let center = (bounds.left) + (bounds.width)/2
      let threshold = (bounds.width/10)
      let offset = -(bounds.width/60)

      if (mousePosition > (center + threshold + offset)) {
        this.mouseDirection = 'left'
      }

      else if (mousePosition < center - threshold + offset) {
        this.mouseDirection = 'right'
      }

      else {
        this.mouseDirection = null
      }
    }
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
    this.element = document.querySelector(`.kanye--${this.id}`)

    // Create renderer
    this.pixiStage = new PIXI.Container()
    this.pixiRenderer = PIXI.autoDetectRenderer(this.kanyeWidth + 10, this.kanyeHeight, {transparent: true})
    this.element.appendChild(this.pixiRenderer.view)

    // Resize renderer
    this.resizeRenderer()

    // Add assets
    this.pixiLoader = PIXI.loader
      .add(`kanye--${this.id}`, 'img/kanye.json')
      .load((loader, res) => {
        this.kanye = new PIXI.spine.Spine(res[`kanye--${this.id}`].spineData)
        this.setAnimationMixes(['breathing', 'shiver', 'bop', 'bopLeft', 'bopRight'])

        if (!Utils.isHighDensity()) {
          this.kanye.scale.x = 1/this.pixiResolution
          this.kanye.scale.y = 1/this.pixiResolution
        }

        this.kanye.position.x = this.kanyeWidth/2
        this.kanye.position.y = this.kanyeHeight

        this.pixiStage.addChild(this.kanye)

        // Events
        this.handleResize()
        this.handleMouseMove()
      })
  }

  setAnimationMixes(animations) {
    animations.map(first => {
      animations.map(second => {
        this.kanye.stateData.setMix(first, second, this.pixiAnimationMix)
      })
    })
  }

  stopAnimation() {
    setTimeout(() => {
      this.isPlaying = false
      this.kanyeBopCount = 0
      cancelAnimationFrame(this.requestAnimationFrame)
      clearTimeout(this.pixiAnimation)
    }, 250)
  }

  playAnimation() {
    this.isPlaying = true
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
    if (this.kanyeIdle) {
      this.bopRandom()
    }

    else {
      if (this.mouseDirection === 'left') {
        this.bopLeft()
      }

      else if (this.mouseDirection === 'right') {
        this.bopRight()
      }

      else {
        this.kanye.state.setAnimation(0, 'bop', false)
      }
    }

    this.blinkRandom()
    this.kanyeBopCount++
  }

  bopFast() {
    if (this.kanyeIdle) {
      this.bopRandomFast()
    }

    else {
      if (this.mouseDirection === 'left') {
        this.bopLeftFast()
      }

      else if (this.mouseDirection === 'right') {
        this.bopRightFast()
      }

      else {
        console.log('Bop Fast')
        this.kanye.state.setAnimation(0, 'bopFast', false)
      }
    }

    this.blinkRandom()
    this.kanyeBopCount++
  }

  bopLeft() {
    console.log('Bop Left')
    this.kanye.state.setAnimation(0, 'bopLeft', false)
    this.kanyeDirection = 'left'
  }

  bopRight() {
    console.log('Bop Right')
    this.kanye.state.setAnimation(0, 'bopRight', false)
    this.kanyeDirection = 'right'
  }

  bopRandom() {
    if (this.kanyeBopCount%(~~(Math.random() * 10) + 1) === 1) {
      console.log('Bop')
      this.kanye.state.setAnimation(0, 'bop', false)
    }

    else if (this.kanyeDirection === 'left') {
      this.bopRight()
    }

    else if (this.kanyeDirection === 'right') {
      this.bopLeft()
    }
  }

  bopLeftFast() {
    console.log('Bop Left')
    this.kanye.state.setAnimation(0, 'bopLeftFast', false)
    this.kanyeDirection = 'left'
  }

  bopRightFast() {
    console.log('Bop Right')
    this.kanye.state.setAnimation(0, 'bopRightFast', false)
    this.kanyeDirection = 'right'
  }

  bopRandomFast() {
    if (this.kanyeBopCount%(~~(Math.random() * 10) + 1) === 1) {
      console.log('Bop Fast')
      this.kanye.state.setAnimation(0, 'bopFast', false)
    }

    else if (this.kanyeDirection === 'left') {
      this.bopRightFast()
    }

    else if (this.kanyeDirection === 'right') {
      this.bopLeftFast()
    }
  }


  openEyes() {
    if (!this.kanyeEyesOpen) {
      console.log('Open Eyes')
      this.kanye.state.setAnimation(1, 'openEyes', true)
      this.kanyeEyesOpen = true
    }
  }

  closeEyes() {
    if (this.kanyeEyesOpen) {
      console.log('Close Eyes')
      this.kanye.state.setAnimation(1, 'closeEyes', true)
      this.kanyeEyesOpen = false
    }
  }

  blink() {
    if (this.kanyeEyesOpen) {
      console.log('Blink')
      this.kanye.state.setAnimation(1, 'blink', false)
    }
  }

  blinkRandom() {
    if (this.kanyeBopCount%(~~(Math.random() * 10) + 1) === 1) {
      this.blink()
    }
  }

  shiver() {
    console.log('Shiver')
    this.kanye.state.setAnimation(0, 'shiver', true)
  }

  render() {
    return (`
      <div class="kanye kanye--${this.id}"></div>
    `)
  }
}
