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
    detectGestures();  // Update zoom and visual based on hand gestures

    // Apply zoom by directly calculating the translation
    translate(0, 0, (zoom - 1) * -1000);  // Zoom effect by translating the camera

    setupLights();  // Set up the lighting

    // Draw the appropriate visual based on currentVisual
    if (currentVisual === "moebius") {
        drawMoebiusStrip();
    } else if (currentVisual === "newVisual") {
        drawNewVisual();
    }
}
function resetNewVisualConditions() {
    newVisualDrawn = false;
    // Additional reset operations can be added here if needed
}

function initNewVisualConditions() {
    newVisualDrawn = true;
    // Initialize settings or conditions for the new visual here
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
    background(0);

    // Set a more subtle scaling factor
    push();
    scale(3);  // Adjust this scaling factor to better fit your visual context

    // Lighting and camera controls to match the visual consistency
    orbitControl(2, 2, 2);
    rotateY(frameCount * 0.02);
    rotateX(frameCount * 0.008);
    rotateZ(frameCount * 0.006);

    // Set lighting to unify the look with the Moebius strip
    ambientLight(0, 10, 0);
    specularMaterial(255, 255, 255);
    pointLight(100, 255, 10, 0, 1000, 0);
    pointLight(0, 77, 125, 0, -1000, 0);

    // Draw objects with adjusted sizes
    normalMaterial();
    rotateX(-QUARTER_PI);
    rotateY(-QUARTER_PI);
    box(50);  // Smaller box
    rotateX(-QUARTER_PI);
    torus(50, 10, 164, 4);  // Smaller torus

    pop();
}


function detectGestures() {
    if (predictions.length > 0) {
        const indexTip = predictions[0].landmarks[8];  // Index finger tip
        const middleTip = predictions[0].landmarks[12];  // Middle finger tip
        const thumbTip = predictions[0].landmarks[4];  // Thumb tip

        // Log for debugging - check in the browser console
        console.log("Index Y:", indexTip[1], "Middle Y:", middleTip[1], "Thumb Y:", thumbTip[1]);

        // Detect scissor gesture: thumb significantly lower than the other fingers
        if (thumbTip[1] < indexTip[1] && thumbTip[1] < middleTip[1]) {
            scissorGestureDetected = true;
        } else {
            scissorGestureDetected = false;
        }

        // Change visual based on gesture only if it has not already been drawn
        if (scissorGestureDetected && !newVisualDrawn) {
            currentVisual = "newVisual";
            newVisualDrawn = true;  // Lock the new visual once it is drawn
        }

        // You can add a condition to switch back to the default visual here
        // Example: if a palm open gesture is detected and the new visual is currently drawn
        // if (palmOpenDetected && newVisualDrawn) {
        //     currentVisual = "moebius";
        //     newVisualDrawn = false;
        // }

        // Map the distance for zoom functionality
        let distance = dist(indexTip[0], indexTip[1], middleTip[0], middleTip[1]);
        zoom = map(distance, 20, 200, 1, 1.5); // Zoom in when distance increases
        zoom = constrain(zoom, 1, 1.5); // Limit the zoom level between 1 (min) and 1.5 (max)
    } else {
        // If no hands are detected, potentially reset to default visual or maintain current state
        // depending on your application needs
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
