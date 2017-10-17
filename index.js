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
const CANVAS_SCALE = 0.16
const ABOVE_GROUND_HEIGHT = canvas.height - (canvas.height * CANVAS_SCALE)
const FOREGROUND_SPEED = canvas.width / 5
const P_TUBE_SEP = 0.427 // 205px / 480px
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
})

$("#ctx").on("click", () => {
  bird.up()
})

function render() {
  if (!bird) bird = new Bird(canvas, UI.bird)
  if (tubes.hasCollisions(bird) || bird.hasFallen()) {
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
  document.write("<H1>GAME OVER G</H1>")
}
