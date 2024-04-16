// https://editor.p5js.org/jht9629-nyu/sketches/5VKqK34Ps
// p5moExamples photo booth 70

// Capture canvas pixels to cloud as image jpg or png

// p5moExamples photo booth 70

// Capture canvas pixels to cloud as image jpg or png

function setup() {
  my_init();
  my.grayEffect = false; // Initialize this property in the setup
  my.slit_scan = 0;
  my.canvas = createCanvas(my.width, my.height);
  my.canvas.mouseReleased(canvas_mouseReleased);
  my.canvas.touchEnded(canvas_touchEnded);
  ui_init();
  video_create();
  dbase_app_init({ completed: startup_completed });
}

function ui_init() {
  effectDropdown = createSelect();
  effectDropdown.position(10, 10);
  effectDropdown.option('Normal');
  effectDropdown.option('Slit Scan');
  effectDropdown.option('Grayscale');  // Changed to Grayscale
  effectDropdown.changed(applyEffect);
}

function applyEffect() {
  let effect = effectDropdown.value();
  switch (effect) {
    case 'Normal':
      my.slit_scan = 0;
      my.grayEffect = false;  // Ensure grayscale is turned off
      break;
    case 'Slit Scan':
      my.slit_scan = 1;
      my.grayEffect = false;
      break;
    case 'Grayscale':  // Handling the Grayscale effect
      my.slit_scan = 0;
      my.grayEffect = true;
      break;
  }
}

function draw_video() {
  if (!my.videoImg) return; // Ensure videoImg is available

  // Apply grayscale filter only if the flag is true
  if (my.grayEffect) {
    filter(GRAY);
  }

  image(my.videoImg, 0, 0);

  if (!my.grayEffect) { // Reset filter effects after drawing the image
    filter(RESET);
  }
}

function draw() {
  clear(); // Ensures the canvas is cleared each frame
  draw_frame();
  draw_number(my.photo_index + 1);
}

function draw_scan() {
  let w = my.videoImg.width;
  let h = my.videoImg.height;
  copy(my.videoImg, w / 2, 0, 1, h, my.x, 0, 1, h);
}

function draw_video() {
  if (my.invertColors) {
  filter(INVERT); // Apply the invert filter here if the flag is true
  }
  image(my.videoImg, 0, 0);
  image(my.videoImg, 0, 0);
  noStroke();
  let index = my.photo_index + 1;
  fill(my.colors[index % my.colors.length]);
  circle(my.x, my.y, my.radius);
}

function draw_number(n) {
  let str = n + '';
  let x = 10;
  let y = my.height;
  textSize(50);
  let a = textAscent();
  let d = textDescent();
  let h = a + d;
  let w = textWidth(str);
  fill(0);
  rect(x, y - h, w, h);
  fill(255);
  text(str, x, y - d);
}

function canvas_mouseReleased() {
  track_xy();
}

function track_xy() {
  let x = mouseX;
  let y = mouseY;
}

function mouseDragged() {
  let onCanvas = mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height;
  return !onCanvas;
}

function windowResized() {
  if (my.isRemote) {
    return;
  }
  resizeCanvas(windowWidth, windowHeight);
}

  // console.log('windowResized width', width, 'height', height);


// https://editor.p5js.org/jht9629-nyu/sketches/twgS6eWRZ
// pixel-grid

// https://editor.p5js.org/jht9629-nyu/sketches/7Wjlo3pPU
// mo-pix-chip-grid jht9629 fireb_firebase.js

// https://editor.p5js.org/jht9629-nyu/sketches/CntV1JQNp
// p5moExamples pixel-grid 47

// [x] Correct display of images - must hit show button
// [x] Add --> Take, keep array of n images and upate
// [x] photo_index

// [x] my.photo_list - show only last n
//    [ { name: "", index: n }, ... ]

// [x] preserve image show order