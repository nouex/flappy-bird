(function (ns) {
  function Ground(canvas, img) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.img = img
    this.entryTime = null;
  }

  Ground.prototype.draw = function () {
    let { img, canvas } = this,
        { width, height } = img,
        nRepeats= Math.ceil(canvas.width / FB.GROUND_W) +1, // +1 b/c they move left so we need an extra to cover that space
        d,
        slideLeftAmount

    if (this.entryTime === null) {
      this.entryTime = new Date()
    }

    d = FB.dForeground(this.entryTime),
    slideLeftAmount = d % FB.GROUND_W


    for (let i = 0; i <nRepeats; i++) {
      this.ctx.drawImage(
          img, 0, 0, width, height, i*FB.GROUND_W - slideLeftAmount,
          FB.ABOVE_GROUND_H, FB.GROUND_W, FB.GROUND_H)
    }
  };

  ns.Ground = Ground
})(FB);
