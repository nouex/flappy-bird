'use strict';

/**
 * 1. quadratic-time vertical speed on space bar
 * 2. stationary up and down bobbing while not playing
 * 3. wings flap while playing
 * 4. tilt up on up and down on down
 */

function Bird(canvas, img) {
  this.img = img
  let {width, height} = img // TODO: scaledWidth
  width = width / 3
  let scaledWidth = canvas.height * 0.0859;// 640 / 55 // canvas height / bird width => 8.5% of canvas height
  let birdRatio  = scaledWidth / width
  let scaledHeight = height * birdRatio
  this.canvas = canvas
  this.height = scaledHeight
  this.width = scaledWidth
  this.x1 = 50
  this.x2 = this.width + this.x1
  this.y1 = canvas.height / 2 - height / 2 // FIXME: should be aboveGroundHeight
  this.y1Start = this.y1
  this.y2 = this.height + this.y1
  this.upStart = null;
  this.flapping = false;
  this.sX = 0
  this.lastFlapTime = null
  this.currFlap = 1
  this.changeFlap(this.currFlap)
}

Bird.prototype.updateY = function () {
  let timeNow =new Date(),
      upStart = this.upStart === null ? timeNow : this.upStart,
      x = (timeNow - upStart) / 1000
  // -70x^2 + 140x + 0 // up 70px in 2sec
  // let y = (Math.pow(x, 2) * -70) + (140 *x) + 0
  let y = (Math.pow(x, 2) * -1570) + (540 *x) + 0
  this.y1 = this.y1Start -y
  this.y2 = this.height + this.y1
};

Bird.prototype.isXBetween = function (l, r) {
  return l <= this.x2 && this.x1 <= r
};

Bird.prototype.isYBetween = function (t, b) {
  return t <= this.y1 && this.y2 <= b
  // 258 <= 214 && 150 <= 43
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

// on spacebar
Bird.prototype.up = function () {
  this.startFlapping()
  this.y1Start = this.y1
  this.upStart = new Date()
};

Bird.prototype.draw = function () {
  let {canvas} = this,
      ctx = canvas.getContext("2d"),
      birdImg = this.img

  this.updateY() // 1.
  this.updateFlapping() // 3.
  ctx.drawImage(
    birdImg, this.sX, 0, birdImg.width / 3, birdImg.height,
    this.x1, this.y1, this.width, this.height
  )
  // ctx.fillStyle = "green"
  // ctx.fillRect(this.x1, this.y1, birdImg.width, birdImg.height )
};
