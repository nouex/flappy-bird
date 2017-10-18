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
const CANVAS_SCALE = 0.16
const SCALED_CANVAS_W = canvas.width * CANVAS_SCALE
const SCALED_GROUND_H = canvas.height * CANVAS_SCALE
const SCALED_ABOVE_GROUND_H = canvas.height - SCALED_GROUND_H
const SCALED_MIN_TUBE_H = 0.037 * SCALED_ABOVE_GROUND_H
let SCALED_TUBE_W; // tmp
const SCALED_BIRD_W = canvas.height * 0.0859;// 640 / 55 // canvas height / bird width => 8.5% of canvas height
const FOREGROUND_SPEED = canvas.width / 5
const FLAPPING_SPEED = 12 // flaps per sec
const HOVER_SPEED = 30 // px per sec
const CREATE_TUBE_AFTER_SPACE_W = 0.427 // 205px / 480px
const SCALED_GAP_H = SCALED_ABOVE_GROUND_H * 0.40
// TODO: rm "Linear" part of name
const dForegroundLinear = (x, itemSpeed = 0) => {
  return helpers.dLinear(x, FOREGROUND_SPEED + itemSpeed)
}
const dFlyEffect = (x) => {
  // -70x^2 + 140x + 0 // up 70px in 2sec
  // let y = (Math.pow(x, 2) * -70) + (140 *x) + 0
  x = ((new Date()) - x) / 1000
  return (Math.pow(x, 2) * -1570) + (540 *x) + 0
}
const dFlapping = (x, itemSpeed = 0) => {
  return helpers.dLinear(x, FLAPPING_SPEED + itemSpeed)
}
const dHover = (x, itemSpeed = 0) => {
  return helpers.dLinear(x, HOVER_SPEED + itemSpeed)
}
const { UI } = Loader;
const ctx = canvas.getContext("2d")
const ground = new Ground(canvas, UI.ground)
const tubes = new Tubes(canvas, UI.tube)
// FIXME: bird.img.height/width === 0 in constructor if we instantinate it here
let bird;
const speed = 1; // initial
// window.requestAnimationFrame = function (fn) {
//   this.setTimeout(fn, 500)
// }
UI.onLoad(() => {
  window.requestAnimationFrame(render)
  SCALED_TUBE_W = UI.tube.width
  let back = UI.background
  background.getContext("2d")
    .drawImage(back, 0, SCALED_GROUND_H  , back.width, back.height, 0, 0, background.width, background.height)
})

$("#ctx").on("click", () => {
  bird.fly()
})

function render() {
  if (!bird) bird = new Bird(canvas, UI.bird)
  if (tubes.hasCollisions(bird) || bird.hasFallen()) {
    bird.stopFlying()
    bird.stopFlapping()
    gameOver();
    return;
  }
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
  ground.draw(speed)
  tubes.draw(speed)
  bird.draw(speed)
  window.requestAnimationFrame(render)
}

function gameOver() {
  // document.write("<H1>GAME OVER G</H1>")
}
