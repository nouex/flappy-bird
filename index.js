(function (FB) {
  function main() {
    /**
      * game loop =>
      *   Invoked by requestAnimationFrame()
      *   0. is it appropriate to update now
      *      e.g. at 60fps updates occur every 16.6ms, if that time hasn't passed
      *           skip this and wait for the time to come
      *   1. calculate new positions of moving parts based on time
      *   2. is it game over i.e. the bird is overlapping obstacles, ground, etc.
      *   3. render
     */

    /**
     * Game Difficulty
     *  Should be determined by the following (in order of likeliness):
     *  NOTE: not all of them should be implemented as that would make it super hard
     *
     *  1. speed of bird (from a user pov, but really speed of incoming obstacles)
     *  2. variation in gap between obstacles. the more variation the harder.
     *  3. variation of where the bypass (where the bird goes thru) of an obstacle is
     *  4. variation in the size of the bypass
     */

    /** NOTE:
     * + fps should be based on the machine's capabilities (see pappu pakia for that)
     */

     /** Blueprint
      * Moving Parts:
      * 1. tubes aka obstacles
      *   + constant speed
      * 2. ground
      *   + constant speed
      * 3. horizon
      *   + constant speed
      * 4. bird (vertical)
      *   + quadratic (http://www.wtamu.edu/academic/anns/mps/math/mathlab/col_algebra/col_alg_tut34_quadfun.htm)
      * 5. bird's rotation when falling
      *   + TBD
      *
      * Avatars:
      * + download from http://flappybird.io/
      *
      * Process of Implementation:
      * 1. ground
      * 2. horizon
      * 3. tubes
      * 4. bird
      * 5. increase difficulty (speed)
      *   + difficulty should be expressed as a global variable so that when we enter
      *     the game loop it gets multiplied to all moving parts' initial speed. Which
      *     means the initial difficult should be 1
      *
      * Notes:
      * + see the general game loop implementation in pappu pakia
      *
      */

    const canvas = document.getElementById("ctx")
    const background = document.getElementById("background")
    const backImg = FB.imgs.background
    FB.FOREGROUND_SPEED = canvas.width / 5 // 1/5 canvas W per sec
    FB.FLAPPING_SPEED = 8 // flaps per sec
    FB.HOVER_SPEED = 30 // px per sec
    FB.SCALE_FACTOR = canvas.width / 828 // images' intrinsics fit a  828px W canvas
    FB.TUBE_W = FB.imgs.tube.width * FB.SCALE_FACTOR
    FB.TUBE_H = FB.imgs.tube.height * FB.SCALE_FACTOR
    FB.TUBE_CREATION_DELAY = 2500
    FB.TUBE_CREATION_DELAY = 2500 // ms
    FB.TUBE_MOUTH_SRC_H = 0.14 * FB.TUBE_H // height to of mouth to crop from img
    FB.TUBE_MOUTH_H = 0.5 * FB.TUBE_MOUTH_SRC_H // height to scale all mouths to
    FB.GROUND_H = FB.imgs.ground.height * FB.SCALE_FACTOR
    FB.GROUND_W = FB.imgs.ground.width * FB.SCALE_FACTOR
    FB.ABOVE_GROUND_H = canvas.height - FB.GROUND_H
    FB.MIN_TUBE_H = 0.037 * (FB.ABOVE_GROUND_H) + FB.TUBE_MOUTH_H // tube is at least 3.7% canvas' height plus a mandatory tube mouth
    FB.BIRD_W = FB.imgs.bird.width / 3 * FB.SCALE_FACTOR;
    FB.BIRD_H = FB.imgs.bird.height * FB.SCALE_FACTOR
    FB.BIRD_PIVOT_DEG = 35
    FB.CREATE_TUBE_AFTER_SPACE_W = 358 * FB.SCALE_FACTOR // 358px @828px canvas W
    FB.GAP_H = FB.ABOVE_GROUND_H * 0.30 // 30% high up in the... sky
    FB.ALL_SCORE_H = (280 / 640) * canvas.height
    FB.ALL_SCORE_W = (285 / 480) * canvas.width
    FB.SPACE_BELOW_SCORE = (30 / 640) * canvas.height
    FB.SPACE_BETW_BTNS = (18 / canvas.height) * canvas.height
    FB.SCORE_H = (142 / 640) * canvas.height
    FB.SCORE_W = (110 / 480) * canvas.width
    FB.BTN_H = (FB.ALL_SCORE_H - FB.SCORE_H - FB.SPACE_BELOW_SCORE - FB.SPACE_BETW_BTNS) /2
    FB.BTN_SM_W = (FB.ALL_SCORE_W - FB.SPACE_BETW_BTNS) /2
    FB.SCORE_Y1 = canvas.height - (canvas.height / 2) - (FB.ALL_SCORE_H / 2),
    FB.BTN_SM_Y1 = FB.SCORE_Y1 + FB.SCORE_H + FB.SPACE_BELOW_SCORE
    FB.BTN_SM_X1 = canvas.width - FB.ALL_SCORE_W - ((canvas.width - FB.ALL_SCORE_W) / 2),
    FB.SCORE_X1 = FB.BTN_SM_X1 + ((FB.ALL_SCORE_W - FB.SCORE_W) / 2)
    FB.SCORE_TXT_FONT_SIZE = (35 / canvas.width) * canvas.width
    FB.SCORE_TXT_FONT_FAMILY = "'Indie Flower', cursive"
    FB.SCORE_TXT_FONT = `${FB.SCORE_TXT_FONT_SIZE}px ${FB.SCORE_TXT_FONT_FAMILY}`
    FB.SCORE_TXT_Y1 = FB.SCORE_Y1 + FB.SCORE_H / 2 - (0.015 * canvas.width) // middle of score img minus %1.5 heigiht // NOTE: unlike drawImage(), the y pos is based off bottom of text
    FB.SCORE_TXT_X1 = FB.SCORE_X1 + (FB.SCORE_W / 2) // FIXME: for it to be 100% centered we have to minus half the text width
    FB.BEST_SCORE_TXT_X1 = FB.SCORE_TEXT_X1 // FIXME: same as above
    FB.BEST_SCORE_TXT_Y1 = FB.SCORE_Y1 + (0.827 * FB.SCORE_H)// FIXME: y1 should also consider font height
    FB.dForeground = (x, itemSpeed = 0) => helpers.dLinear(x, FB.FOREGROUND_SPEED + itemSpeed)
    FB.dFlyEffect = (x) => {
      // -70x^2 + 140x + 0 // up 70px in 2sec
      // let y = (Math.pow(x, 2) * -70) + (140 *x) + 0
      x = ((new Date()) - x) / 1000
      return (Math.pow(x, 2) * -1570) + (540 *x) + 0
    }
    FB.dFlapping = (x, itemSpeed = 0) => helpers.dLinear(x, FB.FLAPPING_SPEED + itemSpeed)
    FB.dHover = (x, itemSpeed = 0) => helpers.dLinear(x, FB.HOVER_SPEED + itemSpeed)
    FB.gameOver = false
    let ground, tubes, bird, ctx, score, bestScore, scoreStartTime
    score = bestScore = 0


    $(document).on("keydown", (ev) => {
      let { which } = ev
      if (which === 32 || which === 38) {
        if (FB.gameOver) {
          gameOn()
        } else {
          if (false === tubes.isCreating)
            setTimeout(() => {
              scoreStartTime = new Date()
              tubes.startCreating()
            }, FB.TUBE_CREATION_DELAY)
          bird.fly()
        }
      }
    })
    // draw background once
    background.getContext("2d")
      .drawImage(
        backImg, 0, FB.GROUND_H  , backImg.width, backImg.height,
        0, 0, background.width, background.height )

    gameOn()

    function render() {
      let isGameOver = false
      // NOTE: hasCollisions() must come before hasFallen() b/c
      //  it updates checks done by hasFallen()
      if (tubes.hasCollisions(bird) || bird.hasFallen()) {
        gameOver();
        isGameOver = true
      }
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
      ground.draw()
      tubes.draw()
      bird.draw()
      if (isGameOver) {
        renderScore()
        scoreStartTime = null

      }
      window.requestAnimationFrame(render)
    }

    function renderScore() {
      const ctx = canvas.getContext("2d"),
            scoreImg = FB.imgs.score,
            restartImg = FB.imgs.restart,
            shareImg = FB.imgs.share,
            atlImg = FB.imgs.addToLeaderboard

      // update score
      // FIXME: 1. the score system is wrong 2. you should ask the tube if it
      //  has passed a certain x point (bird.x1) for score++
      if (scoreStartTime) {
        let distFromCanvasX2ToBirdX1 = canvas.width - bird.x1,
            tubePassInterval = distFromCanvasX2ToBirdX1 / FB.FOREGROUND_SPEED// interval at which a tube passes the bird in secs
        score = Math.ceil(((new Date() - scoreStartTime) / 1000) / tubePassInterval)
        bestScore = Math.max(score, bestScore)
      }
      // score
      ctx.drawImage(
        scoreImg, 0, 0, scoreImg.width, scoreImg.height,
        FB.SCORE_X1, FB.SCORE_Y1, FB.SCORE_W, FB.SCORE_H)
      // restart
      ctx.drawImage(
        restartImg, 0, 0, restartImg.width, restartImg.height,
        FB.BTN_SM_X1, FB.BTN_SM_Y1, FB.BTN_SM_W, FB.BTN_H)
      // share
      ctx.drawImage(
        shareImg, 0, 0, shareImg.width, shareImg.height,
        FB.BTN_SM_X1 + FB.BTN_SM_W + FB.SPACE_BETW_BTNS, FB.BTN_SM_Y1, FB.BTN_SM_W, FB.BTN_H
      )
      // add to leaderboard
      ctx.drawImage(
        atlImg, 0, 0, atlImg.width, atlImg.height,
        FB.BTN_SM_X1, FB.BTN_SM_Y1 + FB.BTN_H + FB.SPACE_BETW_BTNS, FB.BTN_SM_W *2 + FB.SPACE_BETW_BTNS,FB.BTN_H
      )
      ctx.fillStyle = "black"
      ctx.font = FB.SCORE_TXT_FONT;
      // score text
      ctx.fillText(score, FB.SCORE_TXT_X1, FB.SCORE_TXT_Y1);
      // best score text
      ctx.fillText(bestScore, FB.SCORE_TXT_X1, FB.BEST_SCORE_TXT_Y1);
    }

    function gameOver() {

      ground.stop()
      tubes.stop()
      bird.stopFlapping()
      FB.gameOver = true
    }

    function gameOn() {
      score = 0
      ground = new FB.Ground(canvas, FB.imgs.ground)
      tubes = new FB.Tubes(canvas, FB.imgs.tube)
      bird = new FB.Bird(canvas, FB.imgs.bird)
      ctx = canvas.getContext("2d")
      FB.gameOver = false
      window.requestAnimationFrame(render)
    }
  }

  FB.main = main
})(FB);
