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
          rightMostSep = canvas.width - rightMostTube.getX2(),
          createAfterSep = P_TUBE_SEP * canvas.width

      shouldCreate = rightMostSep >= createAfterSep
    }

    shouldCreate = shouldCreate || this.tubes.length === 0

    if (shouldCreate) {
          scaledGroundHeight = canvas.height * CANVAS_SCALE,
          aboveGroundHeight = canvas.height - scaledGroundHeight,
          gap = aboveGroundHeight * 0.40,
          minTubeH = 0.037 * aboveGroundHeight,
          gapTopRange = (aboveGroundHeight - minTubeH *2) - gap,
          gapTopStart = helpers.random(0, gapTopRange +1) + minTubeH
      this.tubes.push(new Tube(this.canvas, gapTopStart))
    }

    const deadTubes = []
    this.tubes.forEach((tube, i) => {
      if (!tube.isVisible()) {
          deadTubes.push(i)
      }
    })

    deadTubes.forEach((_, i) => {
      this.tubes.splice(i, 1)
    })

    this.tubes.forEach((tube) => {
      tube.draw()
    })
  };

  Tubes.prototype.hasCollisions = function (bird) {
    return this.tubes.some((tube) => tube.hasCollision(bird))
  };

  function Tube(canvas, gapTopStart) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.gapTopStart = gapTopStart
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
         scaledGroundHeight = canvas.height * CANVAS_SCALE,
         gap = (canvas.height - scaledGroundHeight) * 0.40,
         aboveGroundHeight = canvas.height - scaledGroundHeight,
         hTop =  aboveGroundHeight/2 -(~~(gap /2)),
         hBot = aboveGroundHeight/2 -(~~(gap /2))

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
      img, 0, 0, width, height, dX, this.gapTopStart + gap, SCALED_CANVAS_WIDTH,
      aboveGroundHeight - (this.gapTopStart + gap))
    ctx.save()
    ctx.rotate(helpers.degToRadians(180))
    ctx.drawImage(
      img, 0, 0, width, height, -dX -SCALED_CANVAS_WIDTH, -this.gapTopStart,
      SCALED_CANVAS_WIDTH, this.gapTopStart )
    ctx.restore()
  };

  Tube.prototype.isVisible = function () {
    let canvas = this.canvas
    if (this.getX2() < 0 || this.getX1() > this.canvas.width) return false
    else return true
  };

  // aka bottom gap edge
  Tube.prototype.bottTubeTopEdge = function () {
    let scaledGroundHeight = this.canvas.height * CANVAS_SCALE,
    gap = (this.canvas.height - scaledGroundHeight) * 0.40
    return this.topTubeBottEdge() + gap
  };

  // aka top gap edge
  Tube.prototype.topTubeBottEdge = function () {
    return this.gapTopStart
  };

  Tube.prototype.hasCollision = function (o) {
    let x1 = this.getX1(),
        x2 = this.getX2(),
        bottTubeTopEdge = this.bottTubeTopEdge(),
        topTubeBottEdge = this.topTubeBottEdge()

    if (o.isXBetween(x1, x2)) {
      if (o.isYBetween(topTubeBottEdge, bottTubeTopEdge)) {
        return false
      }
      return true
    }
    return false
  };

  return Tubes
})();
