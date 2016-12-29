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
    this.pixiScale = 1
    this.pixiResolution = Utils.isHighDensity() ? 1 : 1.5
    this.pixiAnimation = null
    this.requestAnimationFrame = null

    this.kanyeWidth = Utils.isHighDensity() ? 2015 : 2015/this.pixiResolution
    this.kanyeHeight = Utils.isHighDensity() ? 1960 : 1960/this.pixiResolution

    this.kanyeOutfit = null
    this.kanyeOutfits = {
      shared:     ['glasses', 'glasses-flare', 'face-shadow-glasses', 'neck-front', 'shadow', 'shadow-left', 'shadow-right', 'chain-front', 'chain-back', 'chain-links'],
      hoodie:     ['hoodie-body', 'hoodie-hood-front', 'hoodie-hood-back', 'sweater-body', 'sweater-collar', 'neck-front', 'shadow', 'shadow-left', 'shadow-right'],
      letterman:  ['letterman-body', 'letterman-sleeves', 'letterman-bowtie', 'suit-shirt', 'suit-collar', 'glasses', 'glasses-flare', 'face-shadow-glasses'],
      polo:       ['polo-body', 'polo-collar', 'polo-tshirt', 'neck-front', 'chain-front', 'chain-back', 'chain-links', 'chest' , 'shadow', 'shadow-left', 'shadow-right'],
      suit:       ['suit-body', 'suit-collar', 'suit-lapel', 'suit-heart', 'suit-shirt', 'glasses', 'glasses-flare', 'face-shadow-glasses'],
      sweater:    ['sweater-body', 'chest', 'sweater-collar', 'chain-front', 'chain-back', 'chain-links', 'neck-front', 'shadow', 'shadow-left', 'shadow-right'],
      tshirt:     ['tshirt-body', 'chest', 'tshirt-holes', 'tshirt-arms', 'neck-front', 'shadow', 'shadow-left', 'shadow-right']
    }

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

  changeOutfit() {
    if (this.kanyeOutfit === 'tshirt') {
      this.kanye.skeleton.findSlot('shadow').color.a = 0.35
      this.kanye.skeleton.findSlot('shadow-left').color.a = 0.35
      this.kanye.skeleton.findSlot('shadow-right').color.a = 0.35
      this.kanye.skeleton.findSlot('chain-front').data.boneData.x = 450
      this.kanye.skeleton.findSlot('chest').data.boneData.y = 395
    }

    // Merge all outfits
    let hideOutfits = _union(this.kanyeOutfits.shared, this.kanyeOutfits.hoodie, this.kanyeOutfits.letterman, this.kanyeOutfits.polo, this.kanyeOutfits.suit, this.kanyeOutfits.sweater, this.kanyeOutfits.tshirt)

    // Remove current outfit
    hideOutfits = _difference(hideOutfits, this.kanyeOutfits[this.kanyeOutfit])

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

  resizeRenderer() {
    this.pixiScale = _round((window.innerHeight + 20)/this.kanyeHeight, 2)
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
      .add(`kanye--${this.id}`, 'animation/kanye.json')
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
        if (firstAnimation.includes('bopFast') || firstAnimation.includes('bopFastLeft') || firstAnimation.includes('bopFastRight')) {
          this.kanye.stateData.setMix(firstAnimation, secondAnimation, 0.15)
        }

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
