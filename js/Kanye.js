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
    this.requestAnimationFrame = null

    this.kanyeWidth = Utils.isHighDensity() ? 2015 : 2015/this.pixiResolution
    this.kanyeHeight = Utils.isHighDensity() ? 1960 : 1960/this.pixiResolution

    this.kanyeOutfit = null
    this.kanyeOutfits = {
      shared:     [
        'glasses',
        'glasses-flare',
        'face-shadow-glasses',
        'neck-front',
        'shadow',
        'shadow-left',
        'shadow-right',
        'chain-front',
        'chain-back',
        'chain-links'
      ],
      hoodie:     ['hoodie-body', 'hoodie-hood-front', 'hoodie-hood-back', 'sweater-body', 'sweater-collar', 'neck-front', 'shadow', 'shadow-left', 'shadow-right'],
      letterman:  ['letterman-body', 'letterman-sleeves', 'letterman-bowtie', 'suit-shirt', 'suit-collar', 'glasses', 'glasses-flare', 'face-shadow-glasses'],
      polo:       ['polo-body', 'polo-collar', 'polo-tshirt', 'neck-front', 'chain-front', 'chain-back', 'chain-links', 'chest' , 'shadow', 'shadow-left', 'shadow-right'],
      suit:       ['suit-body', 'suit-collar', 'suit-lapel', 'suit-heart', 'suit-shirt', 'glasses', 'glasses-flare', 'face-shadow-glasses'],
      sweater:    ['sweater-body', 'chest', 'sweater-collar', 'neck-front', 'shadow', 'shadow-left', 'shadow-right'],
      tshirt:     ['tshirt-body', 'chest', 'tshirt-holes', 'tshirt-arms', 'neck-front', 'shadow', 'shadow-left', 'shadow-right']
    }

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

  changeOutfit() {
    if (this.kanyeOutfit === 'tshirt') {
      this.kanye.skeleton.findSlot('shadow').color.a = 0.35
      this.kanye.skeleton.findSlot('shadow-left').color.a = 0.35
      this.kanye.skeleton.findSlot('shadow-right').color.a = 0.35
      this.kanye.skeleton.findSlot('chain-front').data.boneData.x = 450
      this.kanye.skeleton.findSlot('chest').data.boneData.y = 395
    }

    let hideOutfits = [...this.kanyeOutfits.shared, ...this.kanyeOutfits.hoodie, ...this.kanyeOutfits.letterman, ...this.kanyeOutfits.polo, ...this.kanyeOutfits.suit, ...this.kanyeOutfits.sweater, ...this.kanyeOutfits.tshirt]

    // Remove duplicates
    hideOutfits = [ ...new Set(hideOutfits)]

    // Remove current outfit
    hideOutfits = hideOutfits.filter(x => this.kanyeOutfits[this.kanyeOutfit].indexOf(x) < 0)

    // Hide slots
    hideOutfits.map(slot => {
      this.kanye.skeleton.findSlot(slot).setAttachment(null)
    })
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
    window.addEventListener('resize', () => {
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
    return new Promise(resolve => {
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

        this.setAnimationMixes([
          'breathing',
          'bopFast', 'bopFastLeft', 'bopFastRight',
          'bopMedium', 'bopMediumLeft', 'bopMediumRight',
          'bopNormal', 'bopNormalLeft', 'bopNormalRight',
          'bopSlow', 'bopSlowLeft', 'bopSlowRight'
        ])

        if (!Utils.isHighDensity()) {
          this.kanye.scale.x = 1/this.pixiResolution
          this.kanye.scale.y = 1/this.pixiResolution
        }

        this.kanye.position.x = this.kanyeWidth/2
        this.kanye.position.y = this.kanyeHeight

        this.changeOutfit()
        this.pixiStage.addChild(this.kanye)

        setTimeout(() => {
          this.pixiRenderer.render(this.pixiStage)
        }, 500)

        // Events
        this.handleResize()
        this.handleMouseMove()
      })
  }

  resetAnimation() {
    this.kanyeBopCount = 0
    // this.pixiRenderer.render(this.pixiStage)
  }

  setAnimationMixes(animations) {
    animations.map(firstAnimation => {
      animations.map(secondAnimation => {
        // Breathing
        if (firstAnimation.includes('breathing') && secondAnimation.includes('breathing')) {
          this.kanye.stateData.setMix(firstAnimation, secondAnimation, 1.5)
        }

        else if (firstAnimation.includes('breathing') || secondAnimation.includes('breathing')) {
          this.kanye.stateData.setMix(firstAnimation, secondAnimation, 0.3)
        }

        // Fast
        else if (firstAnimation.includes('bopFast') || firstAnimation.includes('bopFastLeft') || firstAnimation.includes('bopFastRight') ||
          secondAnimation.includes('bopFast') || secondAnimation.includes('bopFastLeft') || secondAnimation.includes('bopFastRight')) {
          this.kanye.stateData.setMix(firstAnimation, secondAnimation, 0.2)
        }

        // Medium
        else if (firstAnimation.includes('bopMedium') || firstAnimation.includes('bopMediumLeft') || firstAnimation.includes('bopMediumRight') ||
          secondAnimation.includes('bopMedium') || secondAnimation.includes('bopMediumLeft') || secondAnimation.includes('bopMediumRight')) {
          this.kanye.stateData.setMix(firstAnimation, secondAnimation, 0.2)
        }

        // Normal
        // else if (firstAnimation.includes('bopNormal') || firstAnimation.includes('bopNormalLeft') || firstAnimation.includes('bopNormalRight') ||
        //   secondAnimation.includes('bopNormal') || secondAnimation.includes('bopNormalLeft') || secondAnimation.includes('bopNormalRight')) {
        //   this.kanye.stateData.setMix(firstAnimation, secondAnimation, 0.5)
        // }

        // Slow
        // else if (firstAnimation.includes('bopSlow') || firstAnimation.includes('bopSlowLeft') || firstAnimation.includes('bopSlowRight') ||
        //   secondAnimation.includes('bopSlow') || secondAnimation.includes('bopSlowLeft') || secondAnimation.includes('bopSlowRight')) {
        //   this.kanye.stateData.setMix(firstAnimation, secondAnimation, 0.3)
        // }

        else {
          this.kanye.stateData.setMix(firstAnimation, secondAnimation, 0.3)
        }
      })
    })
  }

  stopAnimation() {
    setTimeout(() => {
      this.isPlaying = false
      this.resetAnimation()
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
      if (speed === 'fast') {
        if (direction === 'cycle') {
          this.bopFastCycle()
        }

        else if (direction === 'angle') {
          this.bopFastAngle()
        }

        else {
          this.bopFast()
        }
      }

      else if (speed === 'medium') {
        if (direction === 'cycle') {
          this.bopMediumCycle()
        }

        else if (direction === 'angle') {
          this.bopMediumAngle()
        }

        else {
          this.bopMedium()
        }
      }

      else if (speed === 'normal') {
        if (direction === 'cycle') {
          this.bopNormalCycle()
        }

        else if (direction === 'angle') {
          this.bopNormalAngle()
        }

        else {
          this.bopNormal()
        }
      }

      else if (speed === 'slow') {
        if (direction === 'cycle') {
          this.bopSlowCycle()
        }

        else if (direction === 'angle') {
          this.bopSlowAngle()
        }

        else {
          this.bopSlow()
        }
      }
    }

    else {
      if (speed === 'fast') {
        if (this.mouseDirection === 'left') {
          this.bopFastLeft()
        }

        else if (this.mouseDirection === 'right') {
          this.bopFastRight()
        }

        else {
          this.bopFast()
        }
      }

      else if (speed === 'medium') {
        if (this.mouseDirection === 'left') {
          this.bopMediumLeft()
        }

        else if (this.mouseDirection === 'right') {
          this.bopMediumRight()
        }

        else {
          this.bopMedium()
        }
      }

      else if (speed === 'normal') {
        if (this.mouseDirection === 'left') {
          this.bopNormalLeft()
        }

        else if (this.mouseDirection === 'right') {
          this.bopNormalRight()
        }

        else {
          this.bopNormal()
        }
      }

      else if (speed === 'slow') {
        if (this.mouseDirection === 'left') {
          this.bopSlowLeft()
        }

        else if (this.mouseDirection === 'right') {
          this.bopSlowRight()
        }

        else {
          this.bopSlow()
        }
      }
    }

    this.blinkRandom()
    this.kanyeBopCount++
  }

  bopSlowAngle() {
    if (this.kanyeDirection === 'left') {
      this.bopSlowRight()
    }

    else if (this.kanyeDirection === 'right') {
      this.bopSlowLeft()
    }
  }

  bopMediumAngle() {
    if (this.kanyeDirection === 'left') {
      this.bopMediumRight()
    }

    else if (this.kanyeDirection === 'right') {
      this.bopMediumLeft()
    }
  }

  bopNormalAngle() {
    if (this.kanyeDirection === 'left') {
      this.bopNormalRight()
    }

    else if (this.kanyeDirection === 'right') {
      this.bopNormalLeft()
    }
  }

  bopFastAngle() {
    if (this.kanyeDirection === 'left') {
      this.bopFastRight()
    }

    else if (this.kanyeDirection === 'right') {
      this.bopFastLeft()
    }
  }

  bopSlowCycle() {
    if (this.kanyeBopCount%2 === 0) {
      this.bopSlow()
    }

    else {
      this.bopSlowAngle()
    }
  }

  bopNormalCycle() {
    if (this.kanyeBopCount%2 === 0) {
      this.bopNormal()
    }

    else {
      this.bopNormalAngle()
    }
  }

  bopMediumCycle() {
    if (this.kanyeBopCount%2 === 0) {
      this.bopMedium()
    }

    else {
      this.bopMediumAngle()
    }
  }

  bopFastCycle() {
    if (this.kanyeBopCount%2 === 0) {
      this.bopFast()
    }

    else {
      this.bopFastAngle()
    }
  }

  bopSlow() {
    console.log('Bop Slow')
    this.kanye.state.setAnimation(0, 'bopSlow', false)
  }

  bopSlowLeft() {
    console.log('Bop Left Slow')
    this.kanye.state.setAnimation(0, 'bopSlowLeft', false)
    this.kanyeDirection = 'left'
  }

  bopSlowRight() {
    console.log('Bop Right Slow')
    this.kanye.state.setAnimation(0, 'bopSlowRight', false)
    this.kanyeDirection = 'right'
  }

  bopNormal () {
    console.log('Bop Normal')
    this.kanye.state.setAnimation(0, 'bopNormal', false)
  }

  bopNormalLeft() {
    console.log('Bop Normal Left')
    this.kanye.state.setAnimation(0, 'bopNormalLeft', false)
    this.kanyeDirection = 'left'
  }

  bopNormalRight() {
    console.log('Bop Normal Right')
    this.kanye.state.setAnimation(0, 'bopNormalRight', false)
    this.kanyeDirection = 'right'
  }

  bopMedium() {
    console.log('Bop Medium')
    this.kanye.state.setAnimation(0, 'bopMedium', false)
  }

  bopMediumLeft() {
    console.log('Bop Left Medium')
    this.kanye.state.setAnimation(0, 'bopMediumLeft', false)
    this.kanyeDirection = 'left'
  }

  bopMediumRight() {
    console.log('Bop Right Medium')
    this.kanye.state.setAnimation(0, 'bopMediumRight', false)
    this.kanyeDirection = 'right'
  }

  bopFast() {
    console.log('Bop Fast')
    this.kanye.state.setAnimation(0, 'bopFast', false)
  }

  bopFastLeft() {
    console.log('Bop Left Fast')
    this.kanye.state.setAnimation(0, 'bopFastLeft', false)
    this.kanyeDirection = 'left'
  }

  bopFastRight() {
    console.log('Bop Right Fast')
    this.kanye.state.setAnimation(0, 'bopFastRight', false)
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

  render() {
    return (`
      <div class="kanye kanye--${this.id}"></div>
    `)
  }
}
