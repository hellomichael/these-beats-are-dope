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
    this.kanyeEyesRepeating = 0
    this.kanyeDirection = 'left'
    this.kanyeBopCount = 2
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
    this.mouseTimeout = setTimeout(() => {this.kanyeIdle = true}, 2000)
  }

  setDirection(mousePosition) {
    if (!this.kanyeIdle) {
      let bounds = this.element.querySelector('canvas').getBoundingClientRect()
      let center = (bounds.left) + (bounds.width)/2
      let threshold = (bounds.width/10)
      let offset = -(bounds.width/60)

      if (mousePosition > (center + threshold + offset)) {
        this.mouseDirection = 'right'
      }

      else if (mousePosition < center - threshold + offset) {
        this.mouseDirection = 'left'
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

        this.setAnimationMixes(['breathing', 'shiver', 'bop', 'bopFast', 'bopLeft', 'bopLeftFast', 'bopRight', 'bopRightFast'])

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
    animations.map(firstAnimation => {
      animations.map(secondAnimation => {
        if (firstAnimation.includes('bopFast') || firstAnimation.includes('bopLeftFast') || firstAnimation.includes('bopRightFast') || secondAnimation.includes('bopFast') || secondAnimation.includes('bopLeftFast') || secondAnimation.includes('bopRightFast')) {
          this.kanye.stateData.setMix(firstAnimation, secondAnimation, 0.3)
        }

        else if (firstAnimation.includes('breathing') && secondAnimation.includes('breathing')) {
          this.kanye.stateData.setMix(firstAnimation, secondAnimation, 1.5)
        }

        else {
          this.kanye.stateData.setMix(firstAnimation, secondAnimation, this.pixiAnimationMix)
        }
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

  bopper(speed, direction) {
    if (this.kanyeIdle) {
      if (direction === 'cycle' && speed === 'fast') {
        this.bopCycleFast()
      }

      else if (direction === 'angle' && speed === 'fast') {
        this.bopAngleFast()
      }

      else if (direction === 'cycle') {
        this.bopCycle()
      }

      else if (direction === 'angle') {
        this.bopAngle()
      }

      else if (speed === 'fast') {
        this.bopFast()
      }

      else {
        this.bop()
      }
    }

    else {
      if (speed === 'fast') {
        if (this.mouseDirection === 'left') {
          this.bopLeftFast()
        }

        else if (this.mouseDirection === 'right') {
          this.bopRightFast()
        }

        else {
          this.bopFast()
        }
      }

      else {
        if (this.mouseDirection === 'left') {
          this.bopLeft()
        }

        else if (this.mouseDirection === 'right') {
          this.bopRight()
        }

        else {
          this.bop()
        }
      }
    }

    this.blinkRandom()
    this.kanyeBopCount++
  }

  bopAngle() {
    if (this.kanyeDirection === 'left') {
      this.bopRight()
    }

    else if (this.kanyeDirection === 'right') {
      this.bopLeft()
    }
  }

  bopAngleFast() {
    if (this.kanyeDirection === 'left') {
      this.bopRightFast()
    }

    else if (this.kanyeDirection === 'right') {
      this.bopLeftFast()
    }
  }

  bopCycle() {
    if (this.kanyeBopCount%2 === 0) {
      this.bop()
    }

    else {
      this.bopAngle()
    }
  }

  bopCycleFast() {
    if (this.kanyeBopCount%2 === 0) {
      this.bopFast()
    }

    else {
      this.bopAngleFast()
    }
  }

  bop () {
    console.log('Bop')
    this.kanye.state.setAnimation(0, 'bop', false)
  }

  bopFast() {
    console.log('Bop Fast')
    this.kanye.state.setAnimation(0, 'bopFast', false)
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

  bopLeftFast() {
    console.log('Bop Left Fast')
    this.kanye.state.setAnimation(0, 'bopLeftFast', false)
    this.kanyeDirection = 'left'
  }

  bopRightFast() {
    console.log('Bop Right Fast')
    this.kanye.state.setAnimation(0, 'bopRightFast', false)
    this.kanyeDirection = 'right'
  }

  switchBopDirection() {
    if (this.kanyeDirection === 'left') {
      this.kanyeDirection = 'right'
    }

    else if (this.kanyeDirection === 'right') {
      this.kanyeDirection = 'left'
    }
  }

  breathing() {
    console.log('Breathing')
    this.kanye.state.setAnimation(0, 'breathing', true)
    this.switchBopDirection()
  }

  openCloseEyes() {
    if (this.kanyeEyesOpen) {
      this.closeEyes()
    }

    else {
      this.openEyes()
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
