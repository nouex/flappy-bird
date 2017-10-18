const helpers = (function () {
  'use strict';

  return {
    degToRadians: function degToRadians(deg) {
      return deg * Math.PI/180
    },
    random: function random(min, max) { // min (inclusive), max (exclusive)
      return Math.random() * (max - min) + min;
    },
    dLinear: function (startTime, speedInSecs) {
      let deltaTime = (new Date()) - startTime
      return speedInSecs * (deltaTime / 1000)
    },
    dQuadratic: function () {}
  };
})();
