/**
 * TODO: for all get*() methods, make them getter props instead
 */

const Tubes = (function () {
  function Tubes(canvas) {
    this.tubes = []
    this.canvas = canvas
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

      gapY1Range = (SCALED_ABOVE_GROUND_HEIGHT - SCALED_MIN_TUBE_HEIGHT *2)
        - SCALED_GAP_HEIGHT
      gapY1 = helpers.random(0, gapY1Range +1) + SCALED_MIN_TUBE_HEIGHT
      this.tubes.push(new Tube(canvas, gapY1))
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

  function Tube(canvas, gapY1) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.gapY1 = gapY1
    this.dist = 0
    this.prevTime = null
    this.dX = this.canvas.width -1 // i put the -1 here so isVisible => true
    // and we don't mistakelny create a nother one when we just did it's just
    // 1px offscreen
    this.x1 = (canvas.width -1) - this.dist
  }

  Tube.prototype.getX1 = function () {
    // FIXME: shold'nt it be SCALED_CANVAS_WIDTH ??
    return (canvas.width -1) - this.dist
  };

  Tube.prototype.getX2 = function () {
    return this.getX1() + SCALED_CANVAS_WIDTH
  };

  Tube.prototype.draw = function (v = 1 /* increased speed */) {
    let img = UI.tube,
         {width, height} = img,
         canvas = this.canvas,
         SCALED_GROUND_HEIGHT = canvas.height * CANVAS_SCALE,
         SCALED_ABOVE_GROUND_HEIGHT = canvas.height - SCALED_GROUND_HEIGHT,
         hTop =  SCALED_ABOVE_GROUND_HEIGHT/2 -(~~(SCALED_GAP_HEIGHT/2)),
         hBot = SCALED_ABOVE_GROUND_HEIGHT/2 -(~~(SCALED_GAP_HEIGHT/2))

    // calc dX
    let currTime = new Date(),
        prevTime = this.prevTime === null ? currTime : this.prevTime,
        deltaTime = (currTime - prevTime) / 1000,
        dist = FOREGROUND_SPEED * deltaTime * v,
        currDist = this.dist + dist,
        dX = (canvas.width -1) - currDist // NOTE: -1 so isVisible => true ???

    this.prevTime = currTime
    this.dist = currDist

    // bottom tube
    this.ctx.drawImage(
      img, 0, 0, width, height, dX, this.gapY1 + SCALED_GAP_HEIGHT, SCALED_CANVAS_WIDTH,
      SCALED_ABOVE_GROUND_HEIGHT - (this.gapY1 + SCALED_GAP_HEIGHT))
    ctx.save()
    ctx.rotate(helpers.degToRadians(180))
    ctx.drawImage(
      img, 0, 0, width, height, -dX -SCALED_CANVAS_WIDTH, -this.gapY1,
      SCALED_CANVAS_WIDTH, this.gapY1 )
    ctx.restore()
  };

  Tube.prototype.isVisible = function () {
    let canvas = this.canvas
    if (this.getX2() < 0 || this.getX1() > this.canvas.width) return false
    else return true
  };

  // aka bottom SCALED_GAP_HEIGHTedge
  Tube.prototype.bottTubeY1 = function () {
    return this.topTubeY2() + SCALED_GAP_HEIGHT  };

  // aka top SCALED_GAP_HEIGHTedge
  Tube.prototype.topTubeY2 = function () {
    return this.gapY1
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
