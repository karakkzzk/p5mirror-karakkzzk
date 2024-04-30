let video;
let handpose;
let predictions = [];
let zoom = 1; // Initial zoom level for the visualization
let f = 0; // Frame counter for the Moebius strip animation
let currentVisual = "moebius"; // Initial visual type
let newVisualDrawn = false; // Track if the new visual has been drawn
let scissorGestureDetected = false; // Track if the scissor gesture has been detected
let currentZoomTranslation = 0; // Initial zoom translation

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    noStroke();

    // Setup video capture and ml5.js Handpose model
    video = createCapture(VIDEO);
    video.size(320, 240);
    video.hide();  // Hide the HTML element and draw it in p5.js
    handpose = ml5.handpose(video, () => console.log('Handpose Model Loaded'));
    handpose.on('predict', results => predictions = results);

    // Initialize instructions and button from existing HTML
    initInstructions();

    // Initialize full-screen button
    const fullScreenButton = document.getElementById('fullScreenButton');
    fullScreenButton.addEventListener('click', toggleFullScreen);
}


function draw() {
    background(0);

    // Lighting setup should not change between frames unless intended
    setupLights();

    // Set the translation for zooming and apply a smooth transition
    let targetZoomTranslation = (zoom - 1) * -1000;
    let currentZoomTranslation = lerp(translateZ, targetZoomTranslation, 0.1); // Smooth transition using linear interpolation
    translate(0, 0, currentZoomTranslation);

    // Check which visual to draw and ensure it's reset correctly
    if (currentVisual === "moebius") {
        if (newVisualDrawn) {
            // Reset conditions if coming from a different visual
            resetNewVisualConditions();
        }
        drawMoebiusStrip();
    } else if (currentVisual === "newVisual") {
        if (!newVisualDrawn) {
            // Initialize conditions for new visual
            initNewVisualConditions();
        }
        drawNewVisual();
    }
}

function resetNewVisualConditions() {
    newVisualDrawn = false;
    // Reset any specific settings needed for the Moebius strip
}

function initNewVisualConditions() {
    newVisualDrawn = true;
    // Set any initial conditions or settings specific to the new visual
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function setupLights() {
    [2, -2, 1].map(i => spotLight(255, 255, 255, 0, -400 * i, 400 * i, 0, i, -i));
}

function drawMoebiusStrip() {
    // Large sphere as the backdrop
    push();
    scale(1, 0.5, 1);
    translate(0, -1700);
    fill(100);
    sphere(2000, 33);
    pop();

    // Moebius strip animation
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
        if (f % max == i) {
            translate(30, 0);
            fill('#D3002C');
            sphere(28);
        }
        pop();
    }
    f++;
}

function drawNewVisual() {
    // Set the background color to match the default background color
    background(0);

    // Set the fill color to white
    fill(255);

    // Your visual drawing code goes here
    orbitControl(2, 2, 2);
    rotateY(frameCount * 0.02);
    rotateX(frameCount * 0.008);
    rotateZ(frameCount * 0.006);

    ambientLight(0, 10, 0);
    specularMaterial(255, 255, 255);

    frustum(width / 3, -width / 3, height / 3, -height / 3, -500, 10);
    lightFalloff(1.3, 0.00000000001, 0.0000001);
    pointLight(100, 255, 10, 0, 1000, 0);
    pointLight(0, 77, 125, 0, -1000, 0);

    // Draw objects in white directly
    normalMaterial();
    rotateX(-QUARTER_PI);
    rotateY(-QUARTER_PI);
    box(100);
    rotateX(-QUARTER_PI);
    torus(100, 8, 164, 4);
}



function detectGestures() {
    if (predictions.length > 0) {
        const indexTip = predictions[0].landmarks[8]; // Index finger tip
        const middleTip = predictions[0].landmarks[12]; // Middle finger tip
        const thumbTip = predictions[0].landmarks[4]; // Thumb tip

        // Log for debugging - check in the browser console
        console.log("Index Y:", indexTip[1], "Middle Y:", middleTip[1], "Thumb Y:", thumbTip[1]);

        // Assuming you want the scissor gesture to be thumb significantly lower than the other fingers
        if (thumbTip[1] < indexTip[1] && thumbTip[1] < middleTip[1]) {  
            scissorGestureDetected = true;
        } else {
            scissorGestureDetected = false;
        }

        // Change visual based on gesture
        if (scissorGestureDetected) {
            currentVisual = "newVisual";
            newVisualDrawn = true; // Set newVisualDrawn to true once the new visual is drawn
        } else {
            currentVisual = "moebius";
            newVisualDrawn = false; // Reset newVisualDrawn when switching back to the Moebius visual
        }

        // Map the distance so that a larger distance results in a larger zoom
        let distance = dist(indexTip[0], indexTip[1], middleTip[0], middleTip[1]);
        zoom = map(distance, 20, 200, 1, 1.5); // Zoom in when distance increases
        zoom = constrain(zoom, 1, 1.5); // Limit the zoom level between 1 (min) and 2 (max)
    }
}


function initInstructions() {
    const instructionButton = document.getElementById('instructionButton');
    const instructions = document.getElementById('instructions');

    // Toggle instructions when the button is clicked
    instructionButton.addEventListener('click', () => {
        toggleInstructions(); // Call a function to toggle instructions
    });

    // Hide instructions when the instructions div is clicked
    instructions.addEventListener('click', () => {
        if (instructions.style.display === 'block') {
            instructions.style.display = 'none';  // Hide instructions
            instructionButton.textContent = 'Instructions';
        }
    });
}

function toggleInstructions() {
    // This function toggles the visibility of the instructions
    const instructions = document.getElementById('instructions');
    const instructionButton = document.getElementById('instructionButton');
    if (instructions.style.display === 'block') {
        instructions.style.display = 'none'; // Hide instructions
        instructionButton.textContent = 'Instructions';
    } else {
        instructions.style.display = 'block'; // Show instructions
        instructionButton.textContent = 'Hide Instructions';
    }
}

function toggleFullScreen() {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement ||
        document.mozFullScreenElement || document.msFullscreenElement;

    if (!fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}
