require('../scss/_kanye.scss')

export default class Kanye {
  constructor(options) {
    Object.assign(this, options)
  }

  componentDidMount() {

  }

  render() {
    return (`
      <div class="kanye">
        <div class="kanye__body">
          <picture class="kanye__suit">
            <source srcset="img/@1x/suit.png, img/@2x/suit.png 2x" media="(min-width: 786px)">
            <img srcset="img/@1x/suit.png, img/@2x/suit.png 2x" alt="">
          </picture>

          <picture class="kanye__neck">
            <source srcset="img/@1x/neck.png, img/@2x/neck.png 2x" media="(min-width: 786px)">
            <img srcset="img/@1x/neck.png, img/@2x/neck.png 2x" alt="">
          </picture>

          <picture class="kanye__shirt">
            <source srcset="img/@1x/shirt.png, img/@2x/shirt.png 2x" media="(min-width: 786px)">
            <img srcset="img/@1x/shirt.png, img/@2x/shirt.png 2x" alt="">
          </picture>

          <picture class="kanye__lapel">
            <source srcset="img/@1x/lapel.png, img/@2x/lapel.png 2x" media="(min-width: 786px)">
            <img srcset="img/@1x/lapel.png, img/@2x/lapel.png 2x" alt="">
          </picture>

          <picture class="kanye__heart">
            <source srcset="img/@1x/heart.png, img/@2x/heart.png 2x" media="(min-width: 786px)">
            <img srcset="img/@1x/heart.png, img/@2x/heart.png 2x" alt="">
          </picture>

          <picture class="kanye__collar">
            <source srcset="img/@1x/collar.png, img/@2x/collar.png 2x" media="(min-width: 786px)">
            <img srcset="img/@1x/collar.png, img/@2x/collar.png 2x" alt="">
          </picture>
        </div>

        <div class="kanye__head">
          <picture class="kanye__ears">
            <source srcset="img/@1x/ears.png, img/@2x/ears.png 2x" media="(min-width: 786px)">
            <img srcset="img/@1x/ears.png, img/@2x/ears.png 2x" alt="">
          </picture>

          <picture class="kanye__face">
            <source srcset="img/@1x/face.png, img/@2x/face.png 2x" media="(min-width: 786px)">
            <img srcset="img/@1x/face.png, img/@2x/face.png 2x" alt="">
          </picture>

          <picture class="kanye__face-shadow">
            <source srcset="img/@1x/face-shadow.png, img/@2x/face-shadow.png 2x" media="(min-width: 786px)">
            <img srcset="img/@1x/face-shadow.png, img/@2x/face-shadow.png 2x" alt="">
          </picture>

          <picture class="kanye__eyes">
            <source srcset="img/@1x/eyes.png, img/@2x/eyes.png 2x" media="(min-width: 786px)">
            <img srcset="img/@1x/eyes.png, img/@2x/eyes.png 2x" alt="">
          </picture>

          <picture class="kanye__eyes-closed">
            <source srcset="img/@1x/eyes-closed.png, img/@2x/eyes-closed.png 2x" media="(min-width: 786px)">
            <img srcset="img/@1x/eyes-closed.png, img/@2x/eyes-closed.png 2x" alt="">
          </picture>

          <picture class="kanye__mouth">
            <source srcset="img/@1x/mouth.png, img/@2x/mouth.png 2x" media="(min-width: 786px)">
            <img srcset="img/@1x/mouth.png, img/@2x/mouth.png 2x" alt="">
          </picture>

          <picture class="kanye__lips">
            <source srcset="img/@1x/lips.png, img/@2x/lips.png 2x" media="(min-width: 786px)">
            <img srcset="img/@1x/lips.png, img/@2x/lips.png 2x" alt="">
          </picture>

          <picture class="kanye__beard">
            <source srcset="img/@1x/beard.png, img/@2x/beard.png 2x" media="(min-width: 786px)">
            <img srcset="img/@1x/beard.png, img/@2x/beard.png 2x" alt="">
          </picture>

          <picture class="kanye__nostril-left">
            <source srcset="img/@1x/nostril-left.png, img/@2x/nostril-left.png 2x" media="(min-width: 786px)">
            <img srcset="img/@1x/nostril-left.png, img/@2x/nostril-left.png 2x" alt="">
          </picture>

          <picture class="kanye__nose">
            <source srcset="img/@1x/nose.png, img/@2x/nose.png 2x" media="(min-width: 786px)">
            <img srcset="img/@1x/nose.png, img/@2x/nose.png 2x" alt="">
          </picture>

          <picture class="kanye__nostril-right">
            <source srcset="img/@1x/nostril-right.png, img/@2x/nostril-right.png 2x" media="(min-width: 786px)">
            <img srcset="img/@1x/nostril-right.png, img/@2x/nostril-right.png 2x" alt="">
          </picture>

          <picture class="kanye__hair">
            <source srcset="img/@1x/hair.png, img/@2x/hair.png 2x" media="(min-width: 786px)">
            <img srcset="img/@1x/hair.png, img/@2x/hair.png 2x" alt="">
          </picture>

          <picture class="kanye__forehead">
            <source srcset="img/@1x/forehead.png, img/@2x/forehead.png 2x" media="(min-width: 786px)">
            <img srcset="img/@1x/forehead.png, img/@2x/forehead.png 2x" alt="">
          </picture>

          <picture class="kanye__brow-left">
            <source srcset="img/@1x/brow-left.png, img/@2x/brow-left.png 2x" media="(min-width: 786px)">
            <img srcset="img/@1x/brow-left.png, img/@2x/brow-left.png 2x" alt="">
          </picture>

          <picture class="kanye__brow-right">
            <source srcset="img/@1x/brow-right.png, img/@2x/brow-right.png 2x" media="(min-width: 786px)">
            <img srcset="img/@1x/brow-right.png, img/@2x/brow-right.png 2x" alt="">
          </picture>

          <picture class="kanye__glasses-flare">
            <source srcset="img/@1x/glasses-flare.png, img/@2x/glasses-flare.png 2x" media="(min-width: 786px)">
            <img srcset="img/@1x/glasses-flare.png, img/@2x/glasses-flare.png 2x" alt="">
          </picture>

          <picture class="kanye__glasses">
            <source srcset="img/@1x/glasses.png, img/@2x/glasses.png 2x" media="(min-width: 786px)">
            <img srcset="img/@1x/glasses.png, img/@2x/glasses.png 2x" alt="">
          </picture>
        </div>
      </div>
    `)
  }
}
