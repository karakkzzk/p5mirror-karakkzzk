let handpose;
let video;
let predictions = [];
let modelIsReady = false;

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.size(width, height);

    handpose = ml5.handpose(video, () => {
        // Model is ready
        modelIsReady = true;
        console.log("Model ready!");
        // Show the 'Model Ready' button
        select('#readyButton').style('display', 'block');
    });

    handpose.on("predict", results => {
        predictions = results;
    });

    video.hide();
    // Initially noLoop() to stop drawing until the model is ready and button is clicked
    noLoop();
}

function modelReady() {
    console.log("Model ready!");
    select('#status').html('Model Loaded');
}

// Add this function to handle button click and start the sketch
function buttonClicked() {
    select('#readyButton').style('display', 'none');
    loop(); // Start the draw loop
}

// Bind the button click event
function bindButtonEvent() {
    select('#readyButton').mousePressed(buttonClicked);
}

function draw() {
    if (modelIsReady) {
        image(video, 0, 0, width, height);
        drawKeypoints();
        // Here you can add your zoom functionality based on the keypoints
    }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
    for (let i = 0; i < predictions.length; i += 1) {
        const prediction = predictions[i];
        for (let j = 0; j < prediction.landmarks.length; j += 1) {
            const keypoint = prediction.landmarks[j];
            fill(0, 255, 0);
            noStroke();
            ellipse(keypoint[0], keypoint[1], 10, 10);
        }
    }
}

// Call bindButtonEvent after the setup function
bindButtonEvent();
