import _round from 'lodash/round'
import _union from 'lodash/union'
import _difference from 'lodash/difference'
import * as Utils from './Utils.js'

import Animation from './Animation'
require('../scss/_kanye.scss')

export default class Kanye extends Animation {
  constructor(options) {
    super()

    this.pixiStage = null
    this.pixiLoader = null
    this.pixiRenderer = null
    this.pixiAnimation = null
    this.requestAnimationFrame = null

    this.kanyeOutfits = {
      shared:     ['glasses', 'glasses-flare', 'face-shadow-glasses', 'neck-front', 'shadow', 'shadow-left', 'shadow-right', 'chain-front', 'chain-back', 'chain-links'],
      hoodie:     ['hoodie-body', 'hoodie-hood-front', 'hoodie-hood-back', 'sweater-body', 'sweater-collar', 'neck-front', 'shadow', 'shadow-left', 'shadow-right'],
      letterman:  ['letterman-body', 'letterman-sleeves', 'letterman-bowtie', 'suit-shirt', 'suit-collar', 'glasses', 'glasses-flare', 'face-shadow-glasses'],
      polo:       ['polo-body', 'polo-collar', 'polo-tshirt', 'neck-front', 'chain-front', 'chain-back', 'chain-links', 'chest' , 'shadow', 'shadow-left', 'shadow-right'],
      suit:       ['suit-body', 'suit-collar', 'suit-lapel', 'suit-heart', 'suit-shirt', 'glasses', 'glasses-flare', 'face-shadow-glasses'],
      sweater:    ['sweater-body', 'chest', 'sweater-collar', 'chain-front', 'chain-back', 'chain-links', 'neck-front', 'shadow', 'shadow-left', 'shadow-right'],
      tshirt:     ['tshirt-body', 'chest', 'tshirt-holes', 'tshirt-arms', 'neck-front', 'shadow', 'shadow-left', 'shadow-right']
    }

    this.kanyeWidth = this.isMobile ? 2015/2 : 2015
    this.kanyeHeight = this.isMobile ? 1960/2 : 1960
    this.kanyeOutfit = null
    this.kanyeEyesOpen = false
    this.kanyeEyesRepeating = 0
    this.kanyeDirection = 'Left'
    this.kanyeBopCount = 2
    this.kanyeBreathing = false
    this.kanyeIdle = false
    this.mouseDirection = null
    this.mouseTimeout = null

    Object.assign(this, options)
    this.setIdle()
  }

  changeOutfit(outfit) {
    if (outfit != this.kanyeOutfit) {
      this.kanye.skeleton.setToSetupPose()

      // Tshirt
      if (outfit === 'tshirt') {
        this.kanye.skeleton.findSlot('shadow').color.a = 0.35
        this.kanye.skeleton.findSlot('shadow-left').color.a = 0.35
        this.kanye.skeleton.findSlot('shadow-right').color.a = 0.35
        this.kanye.skeleton.findSlot('chain-front').data.boneData.x = 450
        this.kanye.skeleton.findSlot('chest').data.boneData.y = 395
      }

      else if (outfit === 'hoodie') {
        this.kanye.skeleton.findSlot('sweater-collar').data.boneData.y = 644.81 - 15
      }

      // Merge all outfits
      let hideOutfits = _union(this.kanyeOutfits.shared, this.kanyeOutfits.hoodie, this.kanyeOutfits.letterman, this.kanyeOutfits.polo, this.kanyeOutfits.suit, this.kanyeOutfits.sweater, this.kanyeOutfits.tshirt)

      // Remove current outfit
      hideOutfits = _difference(hideOutfits, this.kanyeOutfits[outfit])

      // Hide slots
      hideOutfits.map(slot => {
        this.kanye.skeleton.findSlot(slot).setAttachment(null)
      })
    }

    this.kanyeOutfit = outfit
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
      this.resizePixi()
      this.resizeRenderer()
    })
  }

  setIdle() {
    clearTimeout(this.mouseTimeout)
    this.mouseTimeout = setTimeout(() => {this.kanyeIdle = true}, 2000)
  }

  setDirection(mousePosition) {
    if (!this.kanyeIdle) {
      let bounds = this.pixiCanvas.querySelector('canvas').getBoundingClientRect()
      let center = (bounds.left) + (bounds.width)/2
      let threshold = (bounds.width/10)
      let offset = -(bounds.width/60)

      if (mousePosition > (center + threshold + offset)) {
        this.mouseDirection = 'Right'
      }

      else if (mousePosition < center - threshold + offset) {
        this.mouseDirection = 'Left'
      }

      else {
        this.mouseDirection = null
      }
    }
  }

  resizePixi() {
    if (this.isMobile && window.innerHeight > window.innerWidth) {
      this.pixiScale = _round((window.innerWidth + 20)/this.kanyeHeight, 2)
    }

    else {
      this.pixiScale = _round((window.innerHeight + 20)/this.kanyeHeight, 2)
    }

    this.pixiResolution = this.isMobile ? 2 : 1.5
    this.pixiWidth = this.kanyeWidth / this.pixiResolution
    this.pixiHeight = this.kanyeHeight / this.pixiResolution
  }

  resizeRenderer() {
    // Resize renderer
    this.pixiRenderer.resize(this.pixiWidth, this.pixiHeight)
    this.pixiRenderer.view.style.transform = `scale(${_round(this.pixiScale * this.pixiResolution , 2)}) translateX(-50%)`

    this.kanye.scale.x = 1 / this.pixiResolution
    this.kanye.scale.y = 1 / this.pixiResolution

    this.kanye.position.x = this.pixiWidth / 2
    this.kanye.position.y = this.pixiHeight
  }

  isReady() {
    return new Promise(resolve => {
      this.pixiLoader.once('complete', event => {
        this.resizePixi()
        this.resizeRenderer()

        resolve(event)
      })
    })
  }

  componentDidMount() {
    this.pixiCanvas = document.querySelector(`.kanye--${this.id}`)

    // Resize renderer
    this.resizePixi()
    this.pixiStage = new PIXI.Container()
    this.pixiRenderer = PIXI.autoDetectRenderer(this.pixiWidth, this.pixiHeight, {transparent: true})
    this.pixiCanvas.appendChild(this.pixiRenderer.view)

    // Add assets
    this.pixiLoader = PIXI.loader
      .add(`kanye--${this.id}`, this.isMobile ? 'animation/kanye.json' : 'animation/kanye@2x.json')
      .load((loader, res) => {
        this.kanye = new PIXI.spine.Spine(res[`kanye--${this.id}`].spineData)

        this.setAnimationMixes([
          'breathing',
          'bopFast', 'bopFastLeft', 'bopFastRight',
          'bopMedium', 'bopMediumLeft', 'bopMediumRight',
          'bopNormal', 'bopNormalLeft', 'bopNormalRight',
          'bopSlow', 'bopSlowLeft', 'bopSlowRight'
        ])

        this.changeOutfit('suit')
        this.pixiStage.addChild(this.kanye)

        setTimeout(() => {
          this.pixiRenderer.render(this.pixiStage)
          this.resizePixi()
          this.resizeRenderer()
        }, 500)

        // Events
        this.handleResize()
        this.handleMouseMove()
      })
  }

  resetAnimation() {
    this.kanyeBopCount = 0
  }

  setAnimationMixes(animations) {
    animations.map(firstAnimation => {
      animations.map(secondAnimation => {
        if (firstAnimation.includes('bopFast') || firstAnimation.includes('bopFastLeft') || firstAnimation.includes('bopFastRight')) {
          this.kanye.stateData.setMix(firstAnimation, secondAnimation, 0.15)
        }

        else {
          this.kanye.stateData.setMix(firstAnimation, secondAnimation, 0.3)
        }
      })
    })
  }

  stopAnimation(direction) {
    if (direction === 'rtl') {
      this.bopRight('Normal')
    }

    else {
      this.bopLeft('Normal')
    }

    setTimeout(() => {
      this.isPlaying = false
      this.kanyeBreathing = false
      this.resetAnimation()
      cancelAnimationFrame(this.requestAnimationFrame)
      clearTimeout(this.pixiAnimation)
    }, 250)
  }

  playAnimation(direction) {
    this.isPlaying = true

    this.pixiAnimation = setTimeout(() => {
      this.requestAnimationFrame = requestAnimationFrame(this.playAnimation.bind(this))
      this.pixiRenderer.render(this.pixiStage)
    }, 1000/60)
  }

  bopper(speed, direction) {
    if (this.kanyeIdle) {
      if (typeof this[`bop${direction}`] === 'function') {
        this[`bop${direction}`](speed)
      }
    }

    else {
      if (typeof this[`bop${this.mouseDirection}`] === 'function' && this.mouseDirection) {
        this[`bop${this.mouseDirection}`](speed)
      }

      else {
        this.bop(speed)
      }
    }

    this.blinkRandom()
    this.kanyeBreathing = false
    this.kanyeBopCount++
  }

  bopAngle(speed) {
    if (this.kanyeDirection === 'Left') {
      this.bopRight(speed)
    }

    else if (this.kanyeDirection === 'Right') {
      this.bopLeft(speed)
    }
  }

  bopCycle(speed) {
    if (this.kanyeBopCount%2 === 0) {
      this.bop(speed)
    }

    else {
      this.bopAngle(speed)
    }
  }

  bop(speed) {
    console.log(`Bop ${speed}`)
    this.kanye.state.setAnimation(0, `bop${speed}`, false)
  }

  bopLeft(speed) {
    console.log(`Bop ${speed} Left`)
    this.kanye.state.setAnimation(0, `bop${speed}Left`, false)
    this.kanyeDirection = 'Left'
  }

  bopRight(speed) {
    console.log(`Bop ${speed} Right`)
    this.kanye.state.setAnimation(0, `bop${speed}Right`, false)
    this.kanyeDirection = 'Right'
  }

  switchBopDirection() {
    if (this.kanyeDirection === 'Left') {
      this.kanyeDirection = 'Right'
    }

    else if (this.kanyeDirection === 'Right') {
      this.kanyeDirection = 'Left'
    }
  }

  breathing() {
    if (!this.kanyeBreathing) {
      console.log('Breathing')
      this.kanye.state.setAnimation(0, 'breathing', true)
      this.switchBopDirection()

      this.kanyeBreathing = true
    }
  }

  tilt(direction) {
    if (!this.kanyeBreathing) {
      if (direction === 'rtl') {
        this.kanye.state.setAnimation(0, 'bopSlowRight', false)
      }

      else {
        this.kanye.state.setAnimation(0, 'bopSlowLeft', false)
      }

      this.kanye.state.addAnimation(0, 'breathing', true, 0)

      this.kanyeBreathing = true
    }
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
