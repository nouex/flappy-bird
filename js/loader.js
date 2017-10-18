const Loader = (function () {
  let awaiting = 0
  let awaitingCb = () => {}
  const onload = () => {
    awaiting--
    if (awaiting === 0) {
      awaitingCb()
    }
  }
  const UI = {
    ground: loadImg("imgs/ground.png"),
    tube: loadImg("imgs/pipe.png"),
    bird: loadImg("imgs/bird.png"),
    background: loadImg("imgs/background.png"),
    onLoad: (fn) => {
      awaitingCb = fn
      if (awaiting === 0) fn();
    }
  }
  return {
    UI
  }

  function loadImg(src) {
    awaiting++
    const img = new Image()
    img.src = src
    img.onload = onload
    return img;
  }
})();
