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
  this.height = height * (SCALED_BIRD_W / width)
  this.width = SCALED_BIRD_W
  this.x1 = 0.15 * canvas.width // 10% of canvas width
  this.x2 = this.width + this.x1
  this.y1 = SCALED_ABOVE_GROUND_H / 2 - this.height / 2 // middle of aboveGroundHeight
  this.y1Idle = this.y1
  this.y2 = this.height + this.y1
  this.upStart = null;
  this.flapping = false;
  this.sX = 0 // "source x" used for drawImage()
  this.lastFlapTime = null
  this.currFlap = 1
  this.lastHoverTime = null
  this.isHoverUp = true
  this.hover = null
  this.prevAdjDist = 0
  this.flying = true;

  this.changeFlap(this.currFlap)
  this.startHover()
  this.startFlapping()
}

Bird.prototype.updateFlapEffect = function () {
  if (!this.flying) return;
  let timeNow = new Date(),
      upStart = this.upStart === null ? timeNow : this.upStart,
      x = (timeNow - upStart) / 1000
  // -70x^2 + 140x + 0 // up 70px in 2sec
  // let y = (Math.pow(x, 2) * -70) + (140 *x) + 0
  let y = (Math.pow(x, 2) * -1570) + (540 *x) + 0,
      y1 = this.y1Idle -y,
      y1Prev = this.y1
  this.y1 = y1
  this.y2 = this.height + this.y1
  this.updatePivot(y1Prev, y1)
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
  if (false === this.flapping) return;
  let {lastFlapTime, currFlap} = this,
      currTime = new Date()
  if (lastFlapTime === null) {
    lastFlapTime = currTime
    this.lastFlapTime = currTime
  }
  // transitions every interval (ms)
  let interval = 1000 / 12,
      timeDiff = currTime - lastFlapTime,
      nBehind = timeDiff / interval, // n of times we are behind in flaps
      nextFlap = (currFlap + Math.floor(nBehind)) % 3

  if (nBehind >=1) {  // update time only if we had to update flap
    this.lastFlapTime = currTime
    this.changeFlap(nextFlap)
  }
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
  let range = 15,
      now = new Date(),
      speed = 30, // 30 px per sec
      lastHoverTime = this.lastHoverTime === null ? now : this.lastHoverTime,
      dist = (now / 1000) * speed,
      adjDist = ~~(dist % range),
      y1Prev = this.y1,
      y1

  if (this.prevAdjDist > adjDist) {
      this.isHoverUp = !this.isHoverUp
  }

  if (this.isHoverUp) {
    y1 = this.y1Idle + adjDist
  } else {
    y1 = this.y1Idle + (range -adjDist)
  }

  this.y1 = y1
  this.y2 = this.height + this.y1
  this.lastHoverTime = now
  this.prevAdjDist = adjDist
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

Bird.prototype.up = function () {
  this.stopHover()
  this.y1Idle = this.y1
  this.upStart = new Date()
};

Bird.prototype.updatePivot = function (prev, next) {
  if (prev < next) this.pivotUp = false
  else this.pivotUp = true
};

Bird.prototype.hasFallen = function () {
  return this.y2 >= SCALED_ABOVE_GROUND_H
};

Bird.prototype.stopFlying = function () {
  this.flying = false
};

Bird.prototype.draw = function () {
  let { ctx, img } = this,
      pivotDeg = this.pivotUp ? -10 : 10

  this.hover ?
    this.updateHover() : // 2.
    this.updateFlapEffect() // 1.
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
