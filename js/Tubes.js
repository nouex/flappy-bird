'use strict';

/**
 * TODO: for all get*() methods, make them getter props instead
 */

const Tubes = (function () {
  function Tubes(canvas, img) {
    this.tubes = []
    this.canvas = canvas
    this.img = img
  }

  Tubes.prototype.draw = function () {
    let rightMostTube = this.tubes[this.tubes.length -1],
        shouldCreate = false,
        { canvas} = this

    if (rightMostTube) {
      let spaceAfterRightMost = canvas.width - rightMostTube.getX2(),
          createTubeAfterSpaceWScaled = CREATE_TUBE_AFTER_SPACE_W * canvas.width

      shouldCreate = spaceAfterRightMost >= createTubeAfterSpaceWScaled
    }
    shouldCreate = shouldCreate || this.tubes.length === 0

    if (shouldCreate) {
      let gapY1Range, gapY1

      gapY1Range = (SCALED_ABOVE_GROUND_H - SCALED_MIN_TUBE_H *2)
        - SCALED_GAP_H
      gapY1 = helpers.random(0, gapY1Range +1) + SCALED_MIN_TUBE_H
      this.tubes.push(new Tube(canvas, this.img, gapY1))
    }

    const deadTubesAt = []
    this.tubes.forEach((tube, at) => {
      if (!tube.isVisible()) deadTubesAt.push(at)
    })

    deadTubesAt.forEach((at) => {
      this.tubes.splice(at, 1)
    })

    this.tubes.forEach((tube) => {
      tube.draw()
    })
  };

  Tubes.prototype.hasCollisions = function (bird) {
    return this.tubes.some((tube) => tube.hasCollision(bird))
  };

  function Tube(canvas, img, gapY1) {
    this.img = img
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.gapY1 = gapY1
    this.x1Reverse = 0 // x1 distance from x-axis' opposite parallel axis (what's it called?)
    this.entryTime = null // time at which it enters the scene
  }

  Tube.prototype.getX1 = function () {
    // FIXME: shold'nt it be SCALED_CANVAS_W ??
    return (canvas.width -1) - this.x1Reverse
  };

  Tube.prototype.getX2 = function () {
    return this.getX1() + SCALED_TUBE_W
  };

  Tube.prototype.draw = function () {
    let  { img, canvas, entryTime }= this,
         { width, height } = img

    if (entryTime === null) {
      entryTime = this.entryTime = new Date()
    }
    this.x1Reverse = dForegroundLinear(entryTime)

    // bottom tube
    this.ctx.drawImage(
      img, 0, 0, width, height, this.getX1(),
      this.gapY1 + SCALED_GAP_H, SCALED_CANVAS_W,
      SCALED_ABOVE_GROUND_H - (this.gapY1 + SCALED_GAP_H)
    )
    // top tube
    ctx.save()
    ctx.rotate(helpers.degToRadians(180))
    ctx.drawImage(
      img, 0, 0, width, height, -this.getX1() -SCALED_CANVAS_W, -this.gapY1,
      SCALED_CANVAS_W, this.gapY1 )
    ctx.restore()
  };

  Tube.prototype.isVisible = function () {
    if (this.getX2() < 0 || this.getX1() > this.canvas.width) return false
    else return true
  };

  // ~bottom gap edge
  Tube.prototype.bottTubeY1 = function () {
    return this.topTubeY2() + SCALED_GAP_H  };

  // ~ top gap edge
  Tube.prototype.topTubeY2 = function () {
    return this.gapY1 -1
  };

  Tube.prototype.hasCollision = function (o) {
    let x1 = this.getX1(),
        x2 = this.getX2(),
        bottTubeY1 = this.bottTubeY1(),
        topTubeY2 = this.topTubeY2()

    if (o.isXBetween(x1, x2)) {
      if (o.isYBetween(topTubeY2, bottTubeY1)) {
        return false
      }
      return true
    }
    return false
  };

  return Tubes
})();
