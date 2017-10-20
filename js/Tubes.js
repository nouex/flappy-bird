(function (FB) {
  'use strict';

  function Tubes(canvas, img) {
    this.tubes = []
    this.canvas = canvas
    this.img = img
    this.isCreating = false
  }

  Tubes.prototype.startCreating = function () {
    this.isCreating = true
  };

  Tubes.prototype.shouldCreate = function () {
    if (!this.isCreating) return false
    let rightMostTube = this.tubes[this.tubes.length -1],
        shouldCreate = false

    if (rightMostTube) {
      let spaceAfterRightMost = this.canvas.width - rightMostTube.x2
          shouldCreate = spaceAfterRightMost >= FB.CREATE_TUBE_AFTER_SPACE_W
    }

    shouldCreate = shouldCreate || this.tubes.length === 0
    return shouldCreate
  };

  Tubes.prototype.draw = function () {
    let { canvas, img } = this,
        deadTubesAt = []

    if (this.shouldCreate()) {
      let gapY1Range, gapY1

      gapY1Range = (FB.ABOVE_GROUND_H - FB.MIN_TUBE_H *2) - FB.GAP_H
      gapY1 = helpers.random(0, gapY1Range +1) + FB.MIN_TUBE_H
      this.tubes.push(new Tube(canvas, img, gapY1))
    }

    this.tubes.forEach((tube, at) =>
      !tube.isVisible() ?  deadTubesAt.push(at) : void(0))

    deadTubesAt.forEach((at) => this.tubes.splice(at, 1))

    this.tubes.forEach((tube) => tube.draw())
  };

  Tubes.prototype.hasCollisions = function (bird) {
    return this.tubes.some((tube) => tube.hasCollision(bird))
  };

  Tubes.prototype.stop = function () {
    this.tubes.forEach((tube) => tube.stop())
  };

  function Tube(canvas, img, gapY1) {
    this.img = img
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.gapY1 = gapY1
    this.x1Reverse = 0 // x1 distance from x-axis' opposite parallel axis (what's it called?)
    this.entryTime = null
    this.stopped = false
  }

  Object.defineProperty(Tube.prototype, "gapY2", {
    enumerable: true,
    configurable: true,
    get: function () {
      return this.gapY1 + FB.GAP_H
    },
    set: function () {
      throw new Error("cannot set")
    }
  })

  Object.defineProperty(Tube.prototype, "x1", {
    enumerable: true,
    configurable: true,
    get: function (){
      return (this.canvas.width -1) - this.x1Reverse
    },
    set: (v) => {throw new Error("cannot set getter-only sTube.prototype.x1")}
  })

  Object.defineProperty(Tube.prototype, "x2", {
    enumerable: true,
    configurable: true,
    get: function () {
      return this.x1 + FB.TUBE_W
    },
    set: function () { throw new Error("cannot set getter-only Tube.prorotype.x2")}
  })

  Tube.prototype.update = function () {
    if (this.stopped) return
    if (this.entryTime === null) {
      this.entryTime = new Date()
    }
    this.x1Reverse = FB.dForeground(this.entryTime)
  };

  Tube.prototype.draw = function () {
    let  { img, ctx }= this,
         { width, height } = img
    this.update()
    // bottom tube
    this.ctx.drawImage(
      img, 0, 0, width, height, this.x1,
      this.gapY2, FB.TUBE_W,
      FB.ABOVE_GROUND_H - this.gapY2
    )
    // top tube
    ctx.save()
    ctx.rotate(helpers.degToRadians(180))
    ctx.drawImage(
      img, 0, 0, width, height, -this.x1 -FB.TUBE_W, -this.gapY1,
      FB.TUBE_W, this.gapY1 )
    ctx.restore()
  };

  Tube.prototype.isVisible = function () {
    if (this.x2 < 0 || this.x1 > this.canvas.width) return false
    else return true
  };

  // ~bottom gap edge
  Tube.prototype.bottTubeY1 = function () {
    return this.topTubeY2() + FB.GAP_H  };

  // ~ top gap edge
  Tube.prototype.topTubeY2 = function () {
    return this.gapY1 -1
  };

  Tube.prototype.hasCollision = function (o) {
    let x1 = this.x1,
        x2 = this.x2,
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

  Tube.prototype.stop = function () {
    this.stopped = true
  };

  FB.Tubes = Tubes
})(FB);
