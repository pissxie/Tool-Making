let rings = 3;
let filaments = 320;

let baseR = [75, 135, 220];

let noiseAmp = [25, 45, 60];
let noiseScale = [0.8, 1.0, 1.3];

let ringColors = [
  [246, 114, 75],
  [252, 138, 85],
  [143, 78, 81]
];

let t = 0;

function setup() {
  createCanvas(600, 600);
  angleMode(RADIANS);
}

function draw() {
  background(43, 51, 73);
  translate(width/2, height/2);

  // Eclipse breathing: outer rings open while inner compresses
  let outerBreath = 1 + 0.15 * sin(t * 0.8);
  let middleBreath = 1 + 0.15 * sin(t * 0.8 + 1.2);
  let innerBreath = 1 - 0.12 * sin(t * 0.8 + 2.1);  // **inverse / compressing**

  let breaths = [innerBreath, middleBreath, outerBreath];

  drawInnerSolid(breaths[0]);

  for (let r = 1; r < rings; r++) {
    drawWavyRing(r, breaths[r]);
  }

  t += 0.02;
}

// INNER: filled + smooth (no hole)
function drawInnerSolid(breath) {
  fill(ringColors[0]);
  noStroke();

  circle(0, 0, baseR[0] * 2 * breath);
  noFill();
}

// WAVY RINGS
function drawWavyRing(r, breath) {
  stroke(ringColors[r]);
  strokeWeight(1.2);

  let offset = r * 700;

  let innerRatio = 0.33;

  for (let i = 0; i < filaments; i++) {
    let a = map(i, 0, filaments, 0, TWO_PI);

    let wave = noise(
      offset + cos(a) * noiseScale[r],
      offset + sin(a) * noiseScale[r]
    ) * noiseAmp[r];

    let outerR = (baseR[r] + wave) * breath;
    let innerR = baseR[r] * innerRatio * breath;

    let tremX = (noise(i*0.3, t*4) - 0.5) * 2.2;
    let tremY = (noise(i*0.4, t*4 + 1000) - 0.5) * 2.2;

    let x1 = innerR * cos(a) + tremX * 0.4;
    let y1 = innerR * sin(a) + tremY * 0.4;
    let x2 = outerR * cos(a) + tremX;
    let y2 = outerR * sin(a) + tremY;

    line(x1, y1, x2, y2);
  }
}
