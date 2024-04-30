let video;
let handpose;
let predictions = [];
let freeze = false;  // Control freeze state
let lastFrame; // To store the last frame when freeze
let f = 0;  // Frame counter for the Moebius strip animation

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);  // Set canvas size based on window size
    noStroke();
    
    video = createCapture(VIDEO);
    video.size(160, 120);  // Smaller video size
    video.hide();  // Hide the default HTML video element

    handpose = ml5.handpose(video, () => console.log('Model ready!'));
    handpose.on('predict', results => predictions = results);

    frameRate(30); // Adjust frame rate as necessary
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(0);

    // Moebius strip and environment visuals
    push();
    translate(0, -height * 0.25);  // Adjust vertical position relative to height
    drawMoebiusStrip();
    pop();

    // Handle the webcam and interactions
    push();
    translate(-width / 2 + 85, height / 2 - 60);  // Position webcam view at the bottom-left
    if (!freeze) {
        // Show live webcam if not frozen
        image(video, 0, 0);
        lastFrame = video.get();  // Capture the current video frame
    } else {
        // Show the last captured video frame when frozen
        image(lastFrame, 0, 0);
    }
    pop();

    detectGestures();
}

function drawMoebiusStrip() {
    // Dynamic lighting and scaling based on canvas size
    [2, -2, 1].map(i => spotLight(255, 255, 255, 0, -400 * i, 400 * i, 0, i, -i));

    // Backdrop
    push();
    scale(1, 0.5, 1);
    translate(0, -1700);
    fill(100);
    sphere(2000, 33);
    pop();

    // Moebius strip
    rotate(PI / 2);
    rotateY(f / 150);
    fill(255);
    let max = 400;
    for (let i = 0; i < max; i++) {
        let I = i * (PI * 2 / max);
        push();
        rotateX(I + f / 50);
        rotate(I);
        translate(sin(I) * 80, cos(I) * 120);
        cylinder(3, 50);

        // Red ball
        if (f % max == i) {
            translate(30, 0);
            pointLight([255], 0, 400, 0);
            pointLight([255], 0, -400, 0);
            fill('#D3002C');
            sphere(28);
        }
        pop();
    }
    f++;
}

function detectGestures() {
    if (predictions.length > 0) {
        const landmarks = predictions[0].landmarks;
        const thumbTip = landmarks[4];
        const pinkyTip = landmarks[20];
        let distance = dist(thumbTip[0], thumbTip[1], pinkyTip[0], pinkyTip[1]);

        if (distance > 100) {
            freeze = false;
        } else {
            freeze = true;
        }
    } else {
        freeze = false;
    }
}
