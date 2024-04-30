let video;
let handpose;
let predictions = [];
let zoom = 1;  // Initial zoom level
let freeze = false;  // Control freeze state
let lastFrame; // To store the last frame when freeze

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.hide();

    handpose = ml5.handpose(video, () => console.log('Model ready!'));
    handpose.on('predict', results => predictions = results);
}

function draw() {
    // Handle freezing and unfreezing visuals
    if (!freeze) {
        // Update background and draw video with current zoom
        background(255);
        translate(width / 2, height / 2);
        scale(zoom);
        image(video, -video.width / 2, -video.height / 2);

        // Store the current frame
        if (zoom < 2) {
            lastFrame = get();
        }
    } else {
        // Display the last stored frame
        image(lastFrame, 0, 0, width, height);
    }

    drawKeypoints();
    detectGestures();
}

function detectGestures() {
    if (predictions.length > 0) {
        const landmarks = predictions[0].landmarks;
        const thumbTip = landmarks[4];
        const pinkyTip = landmarks[20];
        let distance = dist(thumbTip[0], thumbTip[1], pinkyTip[0], pinkyTip[1]);

        // Check if hand is open
        if (distance > 100) {
            if (zoom < 2) {
                zoom += 0.01;  // Increment zoom if not at limit
            }
            freeze = false;  // Ensure visuals are not frozen
        } else {
            // Freeze visuals if hand is closed and distance suggests a fist (rock gesture)
            freeze = true;
        }
    } else {
        // Reset zoom if no hand is detected
        zoom = 1;
        freeze = false;
    }
}

function drawKeypoints() {
    for (let i = 0; i < predictions.length; i++) {
        const prediction = predictions[i];
        for (let j = 0; j < prediction.landmarks.length; j++) {
            const keypoint = prediction.landmarks[j];
            fill(0, 255, 0);
            noStroke();
            ellipse(keypoint[0], keypoint[1], 10, 10);
        }
    }
}
