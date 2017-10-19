(function (ns) {
  'use strict';

  /**
   * 1. quadratic-time vertical speed on space bar
   * 2. stationary up and down bobbing while not playing
   * 3. wings flap while playing
   * 4. tilt up on up and down on down
   */

  function Bird(canvas, img) {
    let { width, height } = img
        width = width / 3

    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.img = img
    // TODO: get rid of this.iwidth ans use BIRD_w all over
    this.height = FB.BIRD_H
    // ABOVE WAS : height * (BIRD_W / width)
    this.width = FB.BIRD_W
    this.x1 = 0.15 * canvas.width // 10% of canvas width
    this.x2 = this.width + this.x1
    this.y1 = FB.ABOVE_GROUND_H / 2 - this.height / 2 // middle of aboveGroundHeight
    this.y1Idle = this.y1
    this.y2 = this.height + this.y1
    this.flapping = false;
    this.sX = 0 // "source x" used for drawImage()
    this.currFlap = 1
    this.isHoverUp = true
    this.hover = null
    this.prevHoverRelDist = 0
    this.flying = true;
    this.flapEntryTime = null
    this.hoverEntryTime = null
    this.flyEffectEntry = null

    this.changeFlap(this.currFlap)
    this.startHover()
    this.startFlapping()
  }

  Bird.prototype.updateFlyEffect = function () {
    if (!this.flying) return;
    if (null === this.flyEffectEntry)
      this.flyEffectEntry = new Date()
    let d = FB.dFlyEffect(this.flyEffectEntry),
        nextY1 = this.y1Idle -d

    this.updatePivot(this.y1, nextY1)
    this.y1 = nextY1
    this.y2 = this.height + this.y1
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
    if (this.flapEntryTime === null)
      this.flapEntryTime = new Date()
    let d = FB.dFlapping(this.flapEntryTime),
        nextFlap = d % 3
    this.changeFlap(~~nextFlap)
  };

  Bird.prototype.changeFlap = function (n) {
    if (~~(n) !== n) throw new Error("'n' must be an integer")
    if (!(0 <= n && n <= 2)) throw new Error("invalid flap n ", n)
    let startAt = (n) * 92,
        endtAt = startAt + 92 +1 // +1 assuming endAt is exclusive
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
      this.y1 = this.y1Idle + hoverRelDist
    } else {
      this.y1 = this.y1Idle + (range -hoverRelDist)
    }

    this.y2 = this.height + this.y1
    this.prevHoverRelDist = hoverRelDist
  };

  Bird.prototype.startHover = function () {
    this.hover = true;
  };

  Bird.prototype.stopHover = function () {
    this.hover = false;
  };

  Bird.prototype.startHover = function () {
    this.hover = true
  };

  Bird.prototype.fly = function () {
    this.stopHover()
    this.y1Idle = this.y1
    this.flyEffectEntry = new Date()
  };

  Bird.prototype.updatePivot = function (prev, next) {
    if (prev < next) this.pivotUp = false
    else this.pivotUp = true
  };

  Bird.prototype.hasFallen = function () {
    return this.y2 >= FB.ABOVE_GROUND_H
  };

  Bird.prototype.stopFlying = function () {
    this.flying = false
  };

  Bird.prototype.draw = function () {
    let { ctx, img } = this,
        pivotDeg = this.pivotUp ? -10 : 10

    this.hover ?
      this.updateHover() : // 2.
      this.updateFlyEffect() // 1.
    this.updateFlapping() // 3.
    // if (!this.hover) {
    //   ctx.save()
    //   ctx.rotate(helpers.degToRadians(pivotDeg))
    // }
    ctx.drawImage(
      img, this.sX, 0, img.width / 3, img.height,
      this.x1, this.y1, this.width, this.height
    )
    // if (!this.hover) ctx.restore()
  };

  ns.Bird = Bird
})(FB);
