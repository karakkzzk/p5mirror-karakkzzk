// Access the instruction button and the instruction div from the HTML
const button = document.getElementById('instructionButton');
const instructions = document.getElementById('instructions');

// Event listener for the instruction button to show instructions
button.addEventListener('click', function(){
    instructions.style.display = "block";  // Show instructions when button is clicked
});

// Event listener for the instructions div to hide instructions when clicked
instructions.addEventListener('click', function(){
    instructions.style.display = "none";  // Hide instructions when instructions are clicked
});
