(function (ns) {
  'use strict';
  function Ground(canvas, img) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.img = img
    this.entryTime = null;
    this.stopped = false
    this.entryTime = null
    this.nRepeats = null
    this.slideLeftAmount = null
  }

  Ground.prototype.stop = function () {
    this.stopped = true
  };

  Ground.prototype.update = function () {
    if (this.stopped) return

    if (this.entryTime === null) {
      this.entryTime = new Date()
    }

    let d = FB.dForeground(this.entryTime)
    this.nRepeats= Math.ceil(this.canvas.width / FB.GROUND_W) +1
    this.slideLeftAmount = d % FB.GROUND_W
  };

  Ground.prototype.draw = function () {
    let { img } = this,
        { width, height } = img

    this.update()
    for (let i = 0; i < this.nRepeats; i++) {
      this.ctx.drawImage(
          img, 0, 0, width, height, i*FB.GROUND_W - this.slideLeftAmount,
          FB.ABOVE_GROUND_H, FB.GROUND_W, FB.GROUND_H)
    }
  };

  ns.Ground = Ground
})(FB);
