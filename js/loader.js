(function (FB) {
  const imgs = {
    ground: "imgs/ground.png",
    tube: "imgs/pipe.png",
    bird: "imgs/bird.png",
    background: "imgs/background.png"
  }

  const imgsFinal = {}

  let awaiting = 0

  for (var name in imgs) {
    if (imgs.hasOwnProperty(name)) {
      let img = new Image()
      img.src = imgs[name]
      imgsFinal[name] = img
      awaiting++
      img.onload = () => {
        awaiting--
        if (awaiting  === 0) {
          FB.main()
        }
      }
    }
  }

  FB.imgs = imgsFinal
})(FB);
