//https://editor.p5js.org/karakkzzk/sketches/aD2bqoiLh
//ims04-kara.z

// Attributes: https://editor.p5js.org/jht9629-nyu/sketches/5VKqK34Ps
// p5moExamples photo booth 70

// Capture canvas pixels to cloud as image jpg or png

let my = {};

function setup() {
  my_init();

  // set group to share cloud data
  my.group = 'group1';

  my.photo_index = 0;
  my.photo_max = 4;
  my.photo_list = [];

  //new
  my.slit_scan = false;
  my.pixel_grid = false;
  my.chip_grid = false;

  // my.imageQuality = 1;
  my.imageQuality = 0.1;
  my.imageExt = '.jpg';
  // my.imageExt = '.png';
  my.thumbWidth = my.vwidth / 2;

  // Lowest pixel density for small uploads
  pixelDensity(1);

  my.canvas = createCanvas(my.width, my.height);
  my.canvas.mouseReleased(canvas_mouseReleased);
  my.canvas.touchEnded(canvas_mouseReleased);

  ui_init();

  video_create();

  dbase_app_init({ completed: startup_completed });

  // for moving circle or video scan line
  my.x = 0;
  my.y = my.height / 2;
  my.xstep = 1;
  my.radius = int(my.width / 10);
  
}

function startup_completed() {
  //
  // dbase_devices_observe({ observed_key, observed_item, all: 1 });
  // dbase_app_observe({ observed_item });
  dbase_group_observe({ observed_key, observed_item });

  function observed_key(key, device) {
    // console.log('observed_a_device key', key, 'uid', my.uid, 'device', device);
    // console.log('observed_key key', key, 'device.photo_index', device && device.photo_index);
  }

  function observed_item(device) {
    // console.log('observed_item device.photo_index', device.photo_index);
    // console.log('observed_item device.photo_list', device.photo_list);
    if (device.photo_list != undefined) {
      my.photo_list = device.photo_list;
    }
    if (device.photo_index != undefined) {
      my.photo_index = device.photo_index;
    }
    show_action();
  }
}

function ui_init() {
  // Button to revert to normal view
  my.normalViewButton = createButton('Normal');
  my.normalViewButton.mousePressed(() => {
    my.slit_scan = false;
    my.pixel_grid = false;
    my.chip_grid = false;
  });
  
  // Button to toggle slit-scan effect
  my.slitScanButton = createButton('Slit-Scan');
  my.slitScanButton.mousePressed(() => my.slit_scan = !my.slit_scan);

  // Button for pixel-grid effect
  my.pixelGridButton = createButton('Pixel-Grid');
  my.pixelGridButton.mousePressed(() => {
    my.pixel_grid = true;
    my.slit_scan = false;
    my.chip_grid = false;
  });

  // Button for mo-pix-chip-grid effect
  my.chipGridButton = createButton('Mo-Pix-Chip-Grid');
  my.chipGridButton.mousePressed(() => {
    my.chip_grid = true;
    my.slit_scan = false;
    my.pixel_grid = false;
  });
  // Save Photo button
  my.savePhotoButton = createButton('Save Photo');
  my.savePhotoButton.mousePressed(savePhoto);

  
  my.photo_count_span = createSpan('Photos: 0');
  my.photo_count_span.position(10, my.height + 50); 
}

function savePhoto() {
  saveCanvas(my.canvas, 'myPhoto', my.imageExt);
}


function draw() {
  draw_frame();
  //draw_number(my.photo_index + 1);
}

function draw_frame() {
  if (my.videoFlag && !video_ready()) return;

  my.videoImg = my.videoFlag ? my.video.get() : null;
  if (!my.videoImg) return;

  if (my.slit_scan) {
    draw_scan();
  } else if (my.pixel_grid) {
    draw_pixel_grid();
  } else if (my.chip_grid) {
    draw_chip_grid();
  } else {
    draw_video();
  }

  my.x = (my.x + my.xstep) % my.width;

  //let str = my.photo_list.length + ' ' + my.photo_index;
  //my.photo_count_span.html(str);
}


function draw_scan() {
  // my.videoImg.loadPixels();
  let w = my.videoImg.width;
  let h = my.videoImg.height;
  copy(my.videoImg, w / 2, 0, 1, h, my.x, 0, 1, h);
}
function draw_pixel_grid() {
  let gridSize = 20; // Size of each grid cell
  let cols = floor(my.width / gridSize);
  let rows = floor(my.height / gridSize);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * gridSize;
      let y = j * gridSize;
      let c = my.videoImg.get(x + gridSize / 2, y + gridSize / 2);
      fill(c);
      noStroke();
      rect(x, y, gridSize, gridSize);
    }
  }
}

function draw_chip_grid() {
  let chipSize = 10; // Size of each chip cell
  let cols = floor(my.width / chipSize);
  let rows = floor(my.height / chipSize);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * chipSize;
      let y = j * chipSize;
      let c = my.videoImg.get(x + chipSize / 2, y + chipSize / 2);
      fill(c);
      stroke(0); // Black borders for chips
      strokeWeight(0.5);
      rect(x, y, chipSize, chipSize);
    }
  }
}


function draw_video() {
  // background(0);
  image(my.videoImg, 0, 0);
  // Draw circle on video
  noStroke();
  let index = my.photo_index + 1;
  fill(my.colors[index % my.colors.length]);
  circle(my.x, my.y, my.radius);
}

function draw_number(n) {
  // Convert number to string
  let str = n + '';
  let x = 10;
  let y = my.height;
  textSize(50);
  // Draw black rect background
  let a = textAscent();
  let d = textDescent();
  let h = a + d;
  let w = textWidth(str);
  fill(0);
  //rect(x, y - h, w, h);
  // Draw white text
  fill(255);
  // x  y bottom-left corner.
  text(str, x, y - d);
}

function canvas_mouseReleased() {
  // console.log('canvas_mouseReleased');
  track_xy();
}

function track_xy() {
  let x = mouseX;
  let y = mouseY;
}

function mouseDragged() {
  // console.log('mouseDragged');
  // required to prevent touch drag moving canvas on mobile
  let onCanvas = mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height;
  if (onCanvas) {
    track_xy();
  }
  // return my.scrollFlag ? true : !onCanvas;
  return !onCanvas;
}

function windowResized() {
  // console.log('windowResized windowHeight', windowHeight, 'windowWidth', windowWidth);
  // my.isPortrait = windowHeight > windowWidth;
  if (my.isRemote) {
    return;
  }
  resizeCanvas(windowWidth, windowHeight);
  // console.log('windowResized width', width, 'height', height);
}

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
