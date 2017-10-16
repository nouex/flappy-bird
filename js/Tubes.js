const Tubes = (function () {
  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function Tubes(canvas) {
    this.tubes = []
    this.canvas = canvas
  }

  Tubes.prototype.draw = function (v) {
    if (this.tubes.length === 0) {
      let canvas = this.canvas,
          scaledGroundHeight = canvas.height * CANVAS_SCALE,
          aboveGroundHeight = canvas.height - scaledGroundHeight,
          gap = aboveGroundHeight * 0.40,
          minTubeH = 0.037 * aboveGroundHeight,
          gapTopRange = (aboveGroundHeight - minTubeH *2) - gap,
          gapTopStart = random(0, gapTopRange +1) + minTubeH
      this.tubes.push(new Tube(this.canvas, gapTopStart))
    }
    const isGameOver = this.tubes.every((tube) => {
      return !tube.checkCollision()
    })
    this.tubes.forEach((tube) => {
      tube.draw(v)
    })
    // isGameOver ? gameOver() : void(0)
  };

  function Tube(canvas, gapTopStart) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.gapTopStart = gapTopStart
    this.dX = this.canvas.width -1 // i put the -1 here so isVisible => true
    // and we don't mistakelny create a nother one when we just did it's just
    // 1px offscreen
  }

  Tube.prototype.draw = function (v) {
    let img = UI.tube,
         {width, height} = img,
         canvas = this.canvas,
         scaledWith = canvas.width * CANVAS_SCALE,
         scaledGroundHeight = canvas.height * CANVAS_SCALE,
         gap = (canvas.height - scaledGroundHeight) * 0.40,
         aboveGroundHeight = canvas.height - scaledGroundHeight,
         hTop =  aboveGroundHeight/2 -(~~(gap /2)),
         hBot = aboveGroundHeight/2 -(~~(gap /2))

    // bottom tube
    this.ctx.drawImage(img, 0, 0, width, height, 0, this.gapTopStart + gap, scaledWith, aboveGroundHeight - (this.gapTopStart + gap))
    ctx.save()
    ctx.rotate(180 * Math.PI/180)
    ctx.drawImage(img, 0, 0, width, height, -scaledWith, -this.gapTopStart, scaledWith, this.gapTopStart )
    ctx.restore()
  };

  Tube.prototype.isVisible = function () {

  };

  Tube.prototype.checkCollision = function (bird) {

  };

  return Tubes
})();
