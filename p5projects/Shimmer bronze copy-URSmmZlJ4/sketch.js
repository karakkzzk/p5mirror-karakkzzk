let video;
let handpose;
let predictions = [];
let zoom = 1;  // Default zoom level
let f = 0;  // Frame counter for animations
let currentVisual = "moebius";  // Start with the Moebius strip

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    noStroke();

    video = createCapture(VIDEO);
    video.size(320, 240);
    video.hide();
    handpose = ml5.handpose(video, () => console.log('Handpose Model Loaded'));
    handpose.on('predict', results => predictions = results);

    initInstructions();
}

function draw() {
    background(0);
    detectGestures();  // Handle zoom and visual switching based on gestures

    translate(0, 0, (zoom - 1) * -1000);  // Apply zoom
    setupLights();

    if (currentVisual === "moebius") {
        drawMoebiusStrip();
    } else if (currentVisual === "newVisual") {
        drawNewVisual();
    }
}

function detectGestures() {
    if (predictions.length > 0) {
        const landmarks = predictions[0].landmarks;
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const pinkyTip = landmarks[20];

        // Control zoom
        let handWidth = dist(thumbTip[0], thumbTip[1], pinkyTip[0], pinkyTip[1]);
        zoom = map(handWidth, 20, 200, 2, 1);
        zoom = constrain(zoom, 1, 2);

        // Detect thumb up by checking if the thumb is significantly higher than the index finger
        if (thumbTip[1] < indexTip[1] - 100) {  // Adjust the threshold to fit your camera setup
            currentVisual = "newVisual";
        } else {
            currentVisual = "moebius";
        }
    }
}

function drawNewVisual() {
    rotateY(f * 0.01);
    let w = 100, d = 20;
    for (let z = -w; z <= w; z += d) {
        for (let y = -w; y <= w; y += d) {
            for (let x = -w; x <= w; x += d) {
                push();
                translate(x, y, z);
                sphere((sin(x / w + y / w + z / w + f * 3) / w) * 20);  // Adjust sphere size
                pop();
            }
        }
    }
    f++;
}

function setupLights() {
    [2, -2, 1].map(i => spotLight(255, 255, 255, 0, -400 * i, 400 * i, 0, i, -i));
}

function initInstructions() {
    const instructionButton = document.getElementById('instructionButton');
    const instructions = document.getElementById('instructions');

    instructionButton.addEventListener('click', () => {
        instructions.style.display = (instructions.style.display === 'none' || !instructions.style.display) ? 'block' : 'none';
        instructionButton.textContent = (instructions.style.display === 'block') ? 'Hide Instructions' : 'Show Instructions';
    });
}
