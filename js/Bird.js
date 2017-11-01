(function (FB) {
  'use strict';

  /**
   * 1. quadratic-time vertical speed on space bar
   * 2. stationary up and down bobbing while not playing
   * 3. wings flap while playing
   * 4. tilt up on up and down on down
   */

  function Bird(canvas, img) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.img = img
    this.x1 = 0.35 * canvas.width
    this.x2 = FB.BIRD_W + this.x1
    this.y1 = FB.ABOVE_GROUND_H / 2 - FB.BIRD_H / 2 // middle of atmosphere
    this.y1Baseline = this.y1
    this.y2 = FB.BIRD_H + this.y1
    this.flapping = false;
    this.sX = 0 // "source x" used for drawImage()
    this.currFlap = 1
    this.isHoverUp = true
    this.hover = null
    this.prevHoverRelDist = 0
    this.flying = true;
    this.flapEntryTime = null
    this.hoverEntryTime = null
    this.flyEffectEntryTime = null
    this.lastDownwardPivotTime = null

    this.changeFlap(this.currFlap)
    this.startHover()
    this.startFlapping()
  }

  Bird.prototype.updateFlyEffect = function () {
    if (!this.flying) return;
    if (null === this.flyEffectEntryTime)
      this.flyEffectEntryTime = new Date()
    let d = FB.dFlyEffect(this.flyEffectEntryTime),
        nextY1 = this.y1Baseline -d,
        nextY2 = nextY1 + FB.BIRD_H

    if (nextY2 >= FB.ABOVE_GROUND_H) {
      this.stopFlying()
    }

    this.updatePivot(this.y1, nextY1)
    this.y1 = nextY1
    this.y2 = FB.BIRD_H + this.y1
  };

  Bird.prototype.isXBetween = function (l, r) {
    return l <= this.x2 && this.x1 <= r
  };

  Bird.prototype.isYBetween = function (t, b) {
    return t <= this.y1 && this.y2 <= b
  };

  Bird.prototype.startFlapping = function () {
    this.flapping = true;
  };

  Bird.prototype.stopFlapping = function () {
    this.flapping = false
  };

  Bird.prototype.updateFlapping = function () {
    if (!this.flapping) return
    if (this.flapEntryTime === null)
      this.flapEntryTime = new Date()
    let d = FB.dFlapping(this.flapEntryTime),
        nextFlap = d % 3
    this.changeFlap(~~nextFlap)
  };

  Bird.prototype.changeFlap = function (n) {
    if (~~(n) !== n) throw new Error("'n' must be an integer")
    if (!(0 <= n && n <= 2)) throw new Error("invalid flap n ", n)
    let birdImgW = FB.imgs.bird.width / 3,
        startAt = (n) * birdImgW

    this.sX = startAt
    this.currFlap = n
  };

  Bird.prototype.updateHover = function () {
    if (false === this.hover) return
    if (false === this.flying) return

    let range, dist, hoverRelDist

    if (this.hoverEntryTime === null)
      this.hoverEntryTime = new Date()

    range = 15
    dist = FB.dHover(this.hoverEntryTime)
    hoverRelDist = ~~(dist % range)

    if (this.prevHoverRelDist > hoverRelDist)
      this.isHoverUp = !this.isHoverUp

    if (this.isHoverUp) {
      this.y1 = this.y1Baseline + hoverRelDist
    } else {
      this.y1 = this.y1Baseline + (range -hoverRelDist)
    }

    this.y2 = FB.BIRD_H + this.y1
    this.prevHoverRelDist = hoverRelDist
  };

  Bird.prototype.startHover = function () {
    this.hover = true;
  };

  Bird.prototype.stopHover = function () {
    this.hover = false;
  };

  Bird.prototype.fly = function () {
    this.stopHover()
    this.y1Baseline = this.y1
    this.flyEffectEntryTime = new Date()
  };

  Bird.prototype.updatePivot = function (prev, next) {
    if (prev < next) this.pivotUp = false
    else this.pivotUp = true
    if (this.pivotUp) {
      this.lastDownwardPivotTime = null
      this.pivotDeg = -FB.BIRD_PIVOT_DEG
    } else {
      if (this.lastDownwardPivotTime === null) {
        this.pivotDeg = 0
        this.lastDownwardPivotTime = new Date()
      }
      let { lastDownwardPivotTime, pivotDeg } = this,
          deltaDeg = FB.dForeground(lastDownwardPivotTime),
          deg = Math.min(FB.BIRD_PIVOT_DEG, pivotDeg + deltaDeg)
          
      this.pivotDeg = ~~deg
    }
  };

  Bird.prototype.hasFallen = function () {
    return this.y2 >= FB.ABOVE_GROUND_H
  };

  Bird.prototype.stopFlying = function () {
    this.flying = false
  };

  Bird.prototype.draw = function () {
    let { ctx, img } = this

    this.hover ?
      this.updateHover() : // 2.
      this.updateFlyEffect() // 1.
    this.updateFlapping() // 3.
    if (!this.hover) { // 4.
      // https://stackoverflow.com/questions/1621321/how-would-one-rotate-an-image-around-itself-using-canvas
      let cX, cY // center of rotation
      cX = this.x1 + FB.BIRD_W / 2
      cY = this.y1 + FB.BIRD_H / 2
      ctx.save()
      ctx.translate(cX, cY)
      ctx.rotate(helpers.degToRadians(this.pivotDeg))
      ctx.translate(-cX, -cY)
    }
    ctx.drawImage(
      img, this.sX, 0, img.width / 3, img.height,
      this.x1, this.y1, FB.BIRD_W, FB.BIRD_H
    )
    if (!this.hover) ctx.restore()
  };

  FB.Bird = Bird
})(FB);
