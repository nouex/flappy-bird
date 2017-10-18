const Ground = (function () {
  function Ground(canvas, img) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.img = img
    this.entryTime = null;
  }

  Ground.prototype.draw = function () {
    let { img, canvas } = this,
        { width, height } = img,
        nRepeats= Math.ceil(canvas.width / width) +1, // +1 i know fixex but idk why
        d,
        slideLeftAmount,
        scaledHeight

    if (this.entryTime === null) {
      this.entryTime = new Date()
    }

    d = dForegroundLinear(this.entryTime),
    slideLeftAmount = d % width,
    scaledHeight = canvas.height * CANVAS_SCALE


    for (let i = 0; i <nRepeats; i++) {
      this.ctx.drawImage(
          img, 0, 0, width, height, i*width - slideLeftAmount,
          canvas.height - scaledHeight, width, scaledHeight)
    }
  };

  return Ground
})();
