// -------------------------------

// CONFIGURATION

// -------------------------------

// Number of rings (inner solid + 2 wavy rings)

let rings = 3;

// Number of line filaments per ring

let filaments = 320;

// Base radius of each ring (inner, middle, outer)

let baseR = [75, 135, 220];

// Noise settings for waviness of each ring

let noiseAmp = [25, 45, 60];     // height of waves

let noiseScale = [0.8, 1.0, 1.3]; // tightening/stretching of waves

// Colors for: inner solid, middle ring, outer ring

let ringColors = [

  [246, 114, 75],

  [252, 138, 85],

  [143, 78, 81]

];

// Animation time counter

let t = 0;

// -------------------------------

// SETUP

// -------------------------------

function setup() {

  createCanvas(600, 600);

  angleMode(RADIANS);   // use radians for angles

}

// -------------------------------

// MAIN DRAW LOOP (runs every frame)

// -------------------------------

function draw() {

  

  // Background + move origin to center of canvas

  background(43, 51, 73);

  translate(width/2, height/2);

  // -------------------------------

  // BREATHING MOTION

  // -------------------------------

  // Each ring has its own breathing rhythm

  let outerBreath = 1 + 0.15  sin(t  0.8);          // expands/shrinks

  let middleBreath = 1 + 0.15  sin(t  0.8 + 1.2);   // offset timing

  let innerBreath = 1 - 0.12  sin(t  0.8 + 2.1);    // opposite direction

  // Store breathing values in order

  let breaths = [innerBreath, middleBreath, outerBreath];

  // Draw solid inner circle

  drawInnerSolid(breaths[0]);

  // Draw each wavy outer ring

  for (let r = 1; r < rings; r++) {

    drawWavyRing(r, breaths[r]);

  }

  // Advance animation time

  t += 0.02;

}

// -------------------------------

// DRAW INNER SOLID CIRCLE (smooth, no waves)

// -------------------------------

function drawInnerSolid(breath) {

  // Fill with inner ring color

  fill(ringColors[0]);

  noStroke();

  // Diameter = radius  2  breathing amount

  circle(0, 0, baseR[0]  2  breath);

  noFill(); // reset

}

// -------------------------------

// DRAW WAVY RINGS MADE OF 320 LINES

// -------------------------------

function drawWavyRing(r, breath) {

  // Set ring color & stroke width

  stroke(ringColors[r]);

  strokeWeight(1.2);

  // Each ring gets its own noise offset

  let offset = r * 700;

  // Percentage of the radius where filaments start (makes the hollow center)

  let innerRatio = 0.33;

  // Loop around full circle for each filament

  for (let i = 0; i < filaments; i++) {

    // Convert index → angle from 0 to 2π

    let a = map(i, 0, filaments, 0, TWO_PI);

    // -------------------------------

    // WAVINESS USING 2D NOISE

    // -------------------------------

    let wave = noise(

      offset + cos(a) * noiseScale[r],

      offset + sin(a) * noiseScale[r]

    ) * noiseAmp[r];

    // Outer radius changes with wave + breathing motion

    let outerR = (baseR[r] + wave) * breath;

    // Inner radius is a smaller fixed percentage of baseR

    let innerR = baseR[r]  innerRatio  breath;

    // Slight trembling motion for organic feel

    let tremX = (noise(i*0.3, t*4) - 0.5) * 2.2;

    let tremY = (noise(i*0.4, t*4 + 1000) - 0.5) * 2.2;

    // -------------------------------

    // CALCULATE FILAMENT ENDPOINTS

    // -------------------------------

    let x1 = innerR  cos(a) + tremX  0.4; // inner point

    let y1 = innerR  sin(a) + tremY  0.4;

    let x2 = outerR * cos(a) + tremX;       // outer point

    let y2 = outerR * sin(a) + tremY;

    // Draw the filament line

    line(x1, y1, x2, y2);

  }

}

