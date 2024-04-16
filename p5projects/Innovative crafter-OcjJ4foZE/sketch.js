
//Attributes:
//forked from: https://openprocessing.org/sketch/2122715
//Comments:
//The author utilizes a set of rules for the automated placement of stairs and floors, and enhances the structure with random decorative elements.
//Key features: 
//- Building object that dynamically adjusts its form in response to user interactions (mouse clicks) to trigger the generation of new structures.
//- Shader: adapted from https://openprocessing.org/sketch/1605869 to create a distinctive, stylized aesthetic reminiscent of pixel art or early computer graphics in the final render.
//- Balance between randomness and structure.
//- Challenges conventional notions of space and structure but also invites viewers to imagine the endless possibilities inherent in procedural generation



//-----------------------------------------------------------
// Labyrinth
// For the WCCChallenge << Improbable architecture >>. Join the discord! https://discord.gg/S8c7qcjw2b

// For this week I wanted to try some architectural designs inspired by Sander Patelski 
// (I love his "Compositions" series - https://shop.studiosanderpatelski.nl/), but as always,
// ended up going in a completely different direction.
// The buildings are generated following a simple set of rules for placing stairs and floors,
// then decorated with some random shapes. The building is then rendered and passed to a
// dithering shader for a nice look
// Dither shader adapted from https://openprocessing.org/sketch/1605869

let cw, ch
let building
let gl, test, theShader
let isOrtho, bgGradient, cf
let fullScreenBtn;
function setup() {
  // Use window dimensions for canvas size
  cw = windowWidth;
  ch = windowHeight;
  createCanvas(cw, ch, WEBGL);
  pixelDensity(1);
  createBgGradient(); // Make sure this function adapts to new cw and ch
  background(255);
  lastChangeTime = millis();

  building = new Building();
  theShader = createFilterShader(frag);
  cf = floor(random(1000));
  
  fullScreenBtn = createButton("Full Screen");
  fullScreenBtn.mousePressed(full_screen_action);
  fullScreenBtn.style("font-size:42px");
}

function windowResized() {
  cw = windowWidth;
  ch = windowHeight;
  resizeCanvas(cw, ch);
  createBgGradient(); // Reinitialize the background gradient with new sizes
  generateNewScene(); // Assuming this function regenerates the building
}

function full_screen_action() {
  fullScreenBtn.remove();
  fullscreen(1);
  let delay = 3000;
  setTimeout(ui_present_window, delay);
}

function ui_present_window() {
  resizeCanvas(windowWidth, windowHeight);
  // Reinitialize or adjust your sketch elements as needed here
}


function draw() {
  if (isOrtho) {
    ortho()
  } else {
    perspective()
  }

  clear()
  background(255)
  push()
  translate(0, 0, -ch / 2)
  scale(2, 2, 1)
  image(bgGradient, -cw / 2, -ch / 2, cw, ch)
  pop()

  push()
  rotateX(-PI / 12)
  rotateY(PI / 4)
  rotateY(frameCount * 0.005)

  ambientLight(150)
  directionalLight(255, 0, 0, 0.25, 0.25, -1)
  pointLight(0, 255, 0, 0, 0, 0)
  specularMaterial(200, 200, 200, 40)
  building._3dDraw()
  pop()

  colorMode(HSB)
  let hue = map(sin(frameCount * 0.0015 + cf), -1, 1, 0, 360)
  let colors = color(hue, 100, 40)._array
  colorMode(RGB)

  theShader.setUniform("uColor", colors)
  theShader.setUniform("resolution", [cw, ch])

  filter(theShader)
    // Automatically change the scene every 5 seconds
  if (millis() - lastChangeTime > 5000) { // 5000 milliseconds = 5 seconds
    generateNewScene(); // Call the function to change the scene
    lastChangeTime = millis(); // Reset the timer for the next change
  }
}



let opposites = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
}
class Building {
  constructor() {
    this.w = floor(random(10, 12));
    this.h = floor(random(10, 12));
    this.numFloors = floor(random(10, 15));
    // Dynamically adjust the size of the building parts based on canvas size
    this.xSize = cw / 20; // Example proportion, adjust based on needs
    this.zSize = ch / 20; // Same as above, for consistency
    this.ySize = (cw + ch) / 40; // Adjust based on the average of canvas dimensions
    this.floors = [];
    this.initializeCells();
    this.build();
  }

  initializeCells() {
    for (let i = 0; i < this.numFloors; i++) {
      let _floor = []
      for (let y = 0; y < this.h; y++) {
        let _row = []
        for (let x = 0; x < this.w; x++) {
          _row.push({
            type: "empty",
            x,
            y,
            floor: i,
            decorations: [],
          })
        }
        _floor.push(_row)
      }
      this.floors.push(_floor)
    }
  }

  getCell(floor, x, y) {
    if (floor < 0 || floor >= this.numFloors) {
      return null
    }
    let _floor = this.floors[floor]
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
      return null
    }
    return _floor[y][x]
  }

  build() {
    let numFloors = this.numFloors

    for (let i = 0; i < numFloors; i++) {
      this.restrictFloor(i)
      this.populateFloor(i)
      this.buildFloor(i)
      if (i === numFloors - 1) {
        this.cleanStairs(i) // Remove all stairs from last floor
      }
    }
    // All cells that remain empty on the first floor, fill with floor
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        let cell = this.getCell(0, x, y)
        if (cell.type === "empty" || cell.type === "stairsEnd") {
          cell.type = "floor"
        }
      }
    }
    // Decorate floors
    for (let i = 0; i < numFloors; i++) {
      this.decorateFloor(i)
    }
  }

  decorateFloor(_floorNumber) {
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        // If cell is a floor type, and the cell below is also a floor type, add a column
        let cell = this.getCell(_floorNumber, x, y)
        let aboveCell = this.getCell(_floorNumber + 1, x, y)
        if (cell.type === "floor" && aboveCell && aboveCell.type === "floor") {
          if (random() < 0.8) {
            cell.decorations.push({ type: "column" })
          }
        } else if (cell.type === "floor") {
          if (random() < 0.2) {
            let cx = random(0.3, 0.7)
            let cy = random(0.3, 0.7)
            let h = random(0.2, 0.3)
            let size = (max(this.xSize, this.ySize) * random(2, 5)) / 20
            let thickness = size / random(2, 4)
            cell.decorations.push({ type: "pot", cx, cy, h, size, thickness })
          } else if (random() < 0.2) {
            let cx = random(0.3, 0.7)
            let cy = random(0.3, 0.7)
            let h = random(0.3, 0.7)
            let size = (max(this.xSize, this.ySize) * random(2, 5)) / 8
            let thickness = size / random(2, 4)
            cell.decorations.push({
              type: "sphere",
              cx,
              cy,
              h,
              size,
              thickness,
            })
          } else if (random() < 0.15) {
            cell.decorations.push({ type: "box", scale: random(0.7, 1.1) })
          }
        }
      }
    }
  }

  restrictFloor(_floorNumber) {
    let numRingsX = map(_floorNumber, 0, this.numFloors, 0, this.w / 6)
    let numRingsY = map(_floorNumber, 0, this.numFloors, 0, this.h / 6)
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        let cell = this.getCell(_floorNumber, x, y)
        if (
          x < numRingsX ||
          x >= this.w - numRingsX ||
          y < numRingsY ||
          y >= this.h - numRingsY
        ) {
          cell.type = "locked"
        }
      }
    }
  }

  cleanStairs(_floorNumber) {
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        let cell = this.getCell(_floorNumber, x, y)
        if (cell.type === "stairs") {
          cell.type = "empty"
        }
      }
    }
  }

  populateFloor(_floorNumber) {
    if (_floorNumber === 0) {
      return
    }
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        let prevCell = this.getCell(_floorNumber - 1, x, y)
        let cell = this.getCell(_floorNumber, x, y)
        if (prevCell.type === "stairsEnd") {
          cell.type = "floor"
        }
      }
    }
  }

  buildFloor(_floorNumber) {
    let requireGround = _floorNumber !== 0
    let maxTries = this.w * this.h * 5
    let stairsToAdd = floor(this.w * this.h * 0.33)
    let totalStairs = 0
    let _floor = this.floors[_floorNumber]
    let _prevFloor = _floorNumber > 0 ? this.floors[_floorNumber - 1] : null
    // Try to add stairs
    while (totalStairs < stairsToAdd && maxTries > 0) {
      let x = floor(random(this.w))
      let y = floor(random(this.h))
      let cell = this.getCell(_floorNumber, x, y)
      let direction = random(["up", "down", "left", "right"])
      // Can place the stair if the cell is empty, and if the target cell
      // (after following the direction) is empty and within the bounds of the floor
      let canPlaceStair = cell.type === "empty"
      let target = null
      let source = null
      let s = (source) => {
        return (
          source &&
          (requireGround ? source.type === "floor" : source.type === "empty")
        )
      }
      let f = (source) => {
        // Check if previous floor has a stair on its source cell that is opposite direction to the current direction
        if (_prevFloor) {
          let prevCell = this.getCell(_floorNumber - 1, source.x, source.y)
          if (prevCell.type === "stairs") {
            return !prevCell.direction === opposites[direction]
          }
        }
        return true
      }
      switch (direction) {
        case "up":
          source = this.getCell(_floorNumber, x, y + 1)
          target = this.getCell(_floorNumber, x, y - 1)
          canPlaceStair = canPlaceStair && s(source) && f(cell)
          canPlaceStair =
            canPlaceStair && target && target.type === "empty" && y > 0
          break
        case "down":
          source = this.getCell(_floorNumber, x, y - 1)
          target = this.getCell(_floorNumber, x, y + 1)
          canPlaceStair = canPlaceStair && s(source) && f(cell)
          canPlaceStair =
            canPlaceStair && target && target.type === "empty" && y < this.h - 1
          break
        case "left":
          source = this.getCell(_floorNumber, x + 1, y)
          target = this.getCell(_floorNumber, x - 1, y)
          canPlaceStair = canPlaceStair && s(source) && f(cell)
          canPlaceStair =
            canPlaceStair && target && target.type === "empty" && x > 0
          break
        case "right":
          source = this.getCell(_floorNumber, x - 1, y)
          target = this.getCell(_floorNumber, x + 1, y)
          canPlaceStair = canPlaceStair && s(source) && f(cell)
          canPlaceStair =
            canPlaceStair && target && target.type === "empty" && x < this.w - 1
          break
      }
      if (canPlaceStair) {
        cell.type = "stairs"
        cell.direction = direction
        target.type = "stairsEnd"
        totalStairs++
      }
      maxTries--
    }

    // For each empty cell, if it has a neighbor that is a floor, and there is no
    // stairs on the floor below, make it a floor with a random diminishing chance
    let chance = 0.6
    let numPasses = 3
    for (let i = 0; i < numPasses; i++) {
      for (let y = 0; y < this.h; y++) {
        for (let x = 0; x < this.w; x++) {
          let cell = this.getCell(_floorNumber, x, y)
          let stairsInPrevFloor =
            !_prevFloor ||
            this.getCell(_floorNumber - 1, x, y).type === "stairs"
          if (cell.type === "empty" && !stairsInPrevFloor) {
            let neighbors = this.getNeighbors(cell, _floor)
            for (let neighbor of neighbors) {
              if (neighbor.type === "floor" && random() < chance) {
                cell.type = "floor"
                cell.added = true
                break
              }
            }
          }
        }
      }
      chance *= 0.5
    }
  }

  getNeighbors(cell) {
    let directions = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ]
    return directions
      .map((d) => {
        let [dx, dy] = d
        return this.getCell(cell.floor, cell.x + dx, cell.y + dy)
      })
      .filter((c) => c)
  }

  _3dDraw(buffer) {
    let xSize = this.xSize
    let ySize = this.ySize
    let zSize = this.zSize
    push()
    // Translate so the building is centered
    let totalW = this.w * xSize
    let totalH = this.floors.length * ySize
    let totalD = this.h * zSize
    translate(-totalW / 2, (totalH / 2) * 0.8, -totalD / 2)
    for (let i = 0; i < this.floors.length; i++) {
      push()
      translate(0, -i * ySize, 0)
      for (let y = 0; y < this.h; y++) {
        for (let x = 0; x < this.w; x++) {
          let cell = this.getCell(i, x, y)
          push()
          translate(cell.x * xSize, 0, cell.y * zSize)
          stroke("#0C213A")
          let r = noise(cell.x, cell.y, i)
          let sw = map(r, 0, 1, 0.5, 3)
          strokeWeight(sw)

          let c = r < 0.5 ? "#303030" : "#909090"
          fill(c)

          if (cell.type === "floor") {
            this._drawFloor(buffer, cell)
            this._drawDecor(buffer, cell)
          } else if (cell.type === "stairs") {
            this._drawStairs(buffer, cell)
          }

          pop()
        }
      }
      pop()
    }
    pop()
  }

  _drawPot(buffer, d) {
    let cx = d.cx * this.xSize
    let cy = d.cy * this.zSize
    let h = d.h * this.ySize
    push()
    noStroke()
    translate(-this.xSize / 2, this.ySize / 2 - h / 2, -this.ySize / 2)
    translate(cx, 0, cy)
    let b = d.thickness

    // Bottom
    push()
    translate(0, h / 2, 0)
    box(d.size, b, d.size)
    pop()
    // Left
    push()
    translate(-d.size / 2, 0, 0)
    box(b, h, d.size)
    pop()
    // Right
    push()
    translate(d.size / 2, 0, 0)
    box(b, h, d.size)
    pop()
    // Front
    push()
    translate(0, 0, -d.size / 2)
    box(d.size, h, b)
    pop()
    // Back
    push()
    translate(0, 0, d.size / 2)
    box(d.size, h, b)
    pop()

    pop()
  }

  _drawSphere(buffer, d) {
    let cx = d.cx * this.xSize
    let cy = d.cy * this.zSize
    let h = d.h * this.ySize
    let b = d.thickness
    let speed = map(noise(d.cx, d.cy, d.h, frameCount * 0.01), 0, 1, 0.01, 0.1)
    let r = map(sin(frameCount * speed), -1, 1, 0.8, 1.5)
    push()
    noStroke()
    translate(-this.xSize / 2, this.ySize / 2 - h / 2, -this.ySize / 2)
    translate(cx, 0, cy)
    translate(0, -h / 2, 0)
    sphere(b * r)
    pop()
  }

  _drawDecor(buffer, cell) {
    for (let d of cell.decorations) {
      switch (d.type) {
        case "column":
          push()
          // Make a cylinder column in the middle of the cell
          noStroke()
          cylinder(max(this.xSize / 6, this.zSize / 6), this.ySize - 4)
          pop()
          break
        case "pot":
          this._drawPot(buffer, d)
          break
        case "sphere":
          this._drawSphere(buffer, d)
          break
        case "box":
          push()
          noFill()
          // translate(-this.xSize / 2, this.ySize / 2, -this.ySize / 2)
          scale(d.scale)
          strokeWeight(1)
          box(this.xSize, this.ySize, this.zSize)
          pop()
          break
      }
    }
  }

  _drawStairs(buffer, cell) {
    let numSteps = 10
    let width =
      cell.direction === "up" || cell.direction === "down"
        ? this.xSize
        : this.zSize
    let length =
      cell.direction === "up" || cell.direction === "down"
        ? this.zSize
        : this.xSize
    let stepSize = length / numSteps
    let stepHeight = this.ySize / numSteps
    push()
    strokeWeight(1)
    translate(0, this.ySize / 2, 0)
    switch (cell.direction) {
      case "up":
        break
      case "down":
        rotateY(PI)
        break
      case "left":
        rotateY(PI / 2)
        break
      case "right":
        rotateY(-PI / 2)
        break
    }
    for (let i = 0; i < numSteps; i++) {
      push()
      translate(0, 0, length / 2 - 2 * stepSize)
      translate(0, -i * stepHeight, -i * stepSize + stepSize)
      box(width, 4, stepSize * 2)
      pop()
    }
    pop()
  }

  _drawStairs2(buffer, cell) {
    push()
    let e =
      cell.direction === "up" || cell.direction === "down"
        ? this.xSize
        : this.zSize
    let f =
      cell.direction === "up" || cell.direction === "down"
        ? this.zSize
        : this.xSize
    let d = sqrt(f * f + this.ySize * this.ySize)

    switch (cell.direction) {
      case "up":
        break
      case "down":
        rotateY(PI)
        break
      case "left":
        rotateY(PI / 2)
        break
      case "right":
        rotateY(-PI / 2)
        break
    }
    // Determine the angle of the plane, on the triangle formed by the diagonal of the box and the height
    let angle = atan(this.ySize / f)
    rotateX(-angle)
    box(e, 2, d)
    pop()
  }

  _drawFloor(buffer, cell) {
    push()
    translate(0, this.ySize / 2, 0)
    if (cell.added) {
      let d = noise(cell.x, cell.y, cell.floor, frameCount * 0.01)
      if (d < 0.5) {
        fill("#30303010")
      }
    }
    box(this.xSize, 2, this.zSize)
    pop()
  }

  _drawArrow(x, y, direction) {
    push()
    translate(x, y)
    switch (direction) {
      case "up":
        rotate(PI)
        break
      case "down":
        break
      case "left":
        rotate(PI / 2)
        break
      case "right":
        rotate(-PI / 2)
        break
    }
    triangle(-5, -5, 5, -5, 0, 5)
    pop()
  }
}

let createBgGradient = () => {
  let graphics = createGraphics(cw, ch);
  graphics.pixelDensity(1);
  // Use cw and ch for gradient dimensions
  let gradient = graphics.drawingContext.createLinearGradient(cw / 2, 0, cw, ch);
  gradient.addColorStop(0, "#555");
  gradient.addColorStop(1, "#AAA");
  graphics.drawingContext.fillStyle = gradient;
  graphics.rect(0, 0, cw, ch);
  bgGradient = graphics;
}

function keyPressed() {
  if (key === "s") {
    saveCanvas("screenshot", "png")
  } else if (key === "o") {
    isOrtho = !isOrtho
  }
}

function generateNewScene() {
  building = new Building(); // Regenerate the building
  createBgGradient(); // Recreate background gradient if needed
  cf = floor(random(1000)); // If needed for randomization in your drawing logic
}

    


//==============================================================================
// Shader
//==============================================================================

// Shader adapted from https://openprocessing.org/sketch/1605869
let frag = `
precision mediump float;

uniform vec2 resolution;
uniform vec3 uColor;
uniform sampler2D tex0;

const float Threshold = 0.5;
const float Multiplicator = 1.0 / 17.0;
const mat4 DitherMatrix = (mat4(
    1, 13, 4, 16,
    9, 5, 12, 8,
    3, 15, 2, 14,
    11, 7, 10, 6
    ) - 8.) * Multiplicator;

float GetLuminance(vec4 c) {
  return (0.2126*c.r + 0.7152*c.g + 0.0722*c.b);
}

float AdjustDither( float val, vec2 coord ) {
    vec2 coordMod = mod(coord, 4.0);
    int xMod = int(coordMod.x);
    int yMod = int(coordMod.y);

    vec4 col;
    if (xMod == 0) col = DitherMatrix[0];
    else if (xMod == 1) col = DitherMatrix[1];
    else if (xMod == 2) col = DitherMatrix[2];
    else if (xMod == 3) col = DitherMatrix[3];

    float adjustment = 0.;
    if (yMod == 0) adjustment = col.x;
    else if (yMod == 1) adjustment = col.y;
    else if (yMod == 2) adjustment = col.z;
    else if (yMod == 3) adjustment = col.w;

    return val + (val * adjustment);
}

void main (void) {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec4 c = texture2D(tex0, uv);

  float luminance = GetLuminance(c);

  if (AdjustDither(luminance, uv*resolution)>Threshold) {
    gl_FragColor = vec4(1., 1., 1., 1.);
  } else {
    // gl_FragColor = vec4(0., 0., 0., 1.);
    gl_FragColor = vec4(uColor, 1.);
  }
}`
