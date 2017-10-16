const Ground = (function () {
  function Ground(canvas, img) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.img = img
    this.prevTime = null;
    this.dist = 0
  }

  Ground.prototype.draw = function (speed) {
    this.canvas.style.border = "solid 1px black"
    let img = this.img,
        { width, height } = img,
        canvas = this.canvas,
        n = Math.ceil(canvas.width / width) +1, // +1 i know fixex but idk why
        currTime = new Date(),
        prevTime = this.prevTime === null ? currTime : this.prevTime,
        deltaTime = (currTime - prevTime) / 1000, // in secs
        dist = FOREGROUND_SPEED * deltaTime * speed, // dist to augment
        currDist = this.dist + dist,
        slideLeftAmount = currDist % width,
        scaledHeight = canvas.height * CANVAS_SCALE

    this.dist = currDist > canvas.width ? 0 : currDist
    this.prevTime = currTime
    for (let i = 0; i < n; i++) {
      this.ctx.drawImage(
          img, 0, 0, width, height, i*width - slideLeftAmount,
          canvas.height - scaledHeight, width, scaledHeight)
    }
  };

  return Ground
})();
