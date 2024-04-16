//https://editor.p5js.org/karakkzzk/sketches/Mtdn3z1CO
//ims03-kara.z

//Attributes: “Event Horizon” by KomaTebehttp://openprocessing.org/sketch/2130260License CreativeCommons Attribution NonCommercial ShareAlikehttps://creativecommons.org/licenses/by-nc-sa/3.0

//comments:
//This modified sketch is an intriguing expansion on the original "Event Horizon" by KomaTebe, enhancing interactivity and adaptability through several key modifications. Here's a breakdown of the changes you've made and their implications on the sketch's functionality and user experience:

//Dynamic Canvas Sizing
//By setting the canvas size to windowWidth and windowHeight, you've made the sketch responsive to the browser window's dimensions. This ensures that the visual experience is optimized across different devices and screen sizes, a significant enhancement over a static canvas size. The windowResized() function further improves this by dynamically adjusting the canvas size as the browser window changes, maintaining the sketch's integrity throughout user interaction.

//Date-Based Visual Variation
//Integrating the current date into the sketch's visual output introduces a dynamic element that changes daily. By using the day, month, and year to influence the background color and rotation speed, the sketch presents a unique experience each day. This temporal element adds a layer of depth, making each interaction with the sketch not just responsive to screen size but also to time.

//Fullscreen Interactivity
//The addition of a fullscreen toggle button significantly enhances user engagement with the sketch. By allowing users to switch between fullscreen and windowed modes, you provide a more immersive experience. This feature is particularly impactful for visual sketches like this one, where the scale of the visuals can dramatically affect the viewer's experience. The button's dynamic label change ("Full Screen" / "Windowed") based on the fullscreen state is a thoughtful touch, improving the UI's intuitiveness.

let f=0;
let now;
let day, month, year;
let fullscreenBtn; // Button for toggling fullscreen

function setup(){
  createCanvas(windowWidth, windowHeight); // Set the canvas to fill the window
  now = new Date();
  day = now.getDate();
  month = now.getMonth() + 1;
  year = now.getFullYear();
  
  fullscreenBtn = createButton('Full Screen'); // Create the full screen button
  fullscreenBtn.position(10, 10); // Position the button
  fullscreenBtn.mousePressed(toggleFullscreen); // Specify the action on click
}

function draw(){
  let W = min(windowWidth, windowHeight); // Use the smaller dimension for square canvas behavior
  background(month*10, day*2, year%100);
  translate(width/2, height/2); // Center the drawing in the canvas
  rotate(f/W * (day/15));
  
  if(W > 0){
    for(let z=255; z>=0; z-=2){
      for(let i=0;i<TAU;i+=PI/64){ 
        let n=noise(i, tan(i)/90000, (f+z)/100);
        push();
        rotate(i);
        stroke(W-z);
        point(0, z*n);
        stroke(W, 77);
        point(z-n*W, i*12);
        pop();
      }
    }
  }
  f-=2;
}

// Toggle between full screen and windowed mode
function toggleFullscreen() {
  let fs = fullscreen();
  fullscreen(!fs);
  if (!fs) {
    fullscreenBtn.hide(); // Hide the button when entering fullscreen mode
  } else {
    fullscreenBtn.show(); // This line is more theoretical unless you're toggling fullscreen status elsewhere
  }
}

// Adjust canvas size dynamically when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


// ----------------------------------------
// Minimized
// ----------------------------------------
// f=0,draw=t=>{if(f||createCanvas(W=400,W),background(0),r=W,translate(200,200),rotate(f/W),r>0)for(z=255;z>=0;z-=2)for(i=0;i<TAU;i+=PI/64)push(n=noise(i,tan(i)/9e4,(f+z)/100)),rotate(i),stroke(W-z),point(0,z*n),stroke(W,77),point(z-n*W,12*i),pop(),r--;f-=2};//#つぶやきProcessing