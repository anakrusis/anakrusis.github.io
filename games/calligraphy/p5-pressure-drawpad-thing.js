const MAXSTROKE = 7.0;
const MINSTROKE = 3.0;
const PRESSUREDECAY = 0.6;
const STATE = {
  paths: [],
  currentPath: undefined,
  currStrength: 0.0
}
function setup() {
  createCanvas(800, 800);
}

function midpoint(pointa, pointb) {
  return {x: 0.5 * (pointa.x + pointb.x), y: 0.5 * (pointa.y + pointb.y), p: 0.5 * (pointa.p + pointb.p)};
}

function drawPath(path) {
  stroke(12,12,12)
  noFill();
  beginShape();
  for (const i in path) {
    if (i < 3) {
      if (i == 0) {
        vertex(path[0].x, path[0].y);
      }
      continue;
    }
    
    const pointc = path[i-2];
    const pointb = path[i-1];
    const pointa = path[i];
    const midcb = midpoint(pointc, pointb);
    const midba = midpoint(pointb, pointa);
    const p = 0.5 * (midcb.p + midba.p);
    strokeWeight(map(p, 0, 4, MINSTROKE, MAXSTROKE));
    quadraticVertex(midcb.x, midcb.y, midba.x, midba.y);
    if (i % 2 == 1) {
      endShape();
      beginShape();
      vertex(midba.x, midba.y);
    }
    
  }
  noStroke();
}

const strengthKeys = {
  'z': 90,
  'x': 88,
  'c': 67,
  'v': 86
};

function countKeyDowns() {
  let strength = 0;
  for (const c in strengthKeys) {
    if (keyIsDown(strengthKeys[c])) {
      strength++;
    }
  }
  return strength;
}

function draw() {
  background(220);
  if (mouseIsPressed) {
    if (STATE.currentPath === undefined) {
      STATE.currentPath = [];
    }
    // running average for "fake keyboard-based pen pressure"
    const strength = PRESSUREDECAY * countKeyDowns() + (1-PRESSUREDECAY) * STATE.currStrength;
    STATE.currentPath.push({x: mouseX, y: mouseY, p: strength});
    STATE.currStrength = strength;
  }
  else {
    if (STATE.currentPath !== undefined) {
      STATE.paths.push(STATE.currentPath);
      STATE.currentPath = undefined;
    }
  }
  
  for (const i in STATE.paths) {
    drawPath(STATE.paths[i]);
  }
  drawPath(STATE.currentPath);
}
