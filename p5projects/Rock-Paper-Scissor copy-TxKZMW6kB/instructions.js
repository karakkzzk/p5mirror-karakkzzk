var button = document.getElementById('instructionButton');
var instructions = document.getElementById('instructions');
button.addEventListener('click', function(){
    instructions.style.display = "block";
})
instructions.addEventListener('click', function(){
    instructions.style.display = "none";
})