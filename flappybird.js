let board = document.getElementById("board");
let boardWidth = 380;
let boardHeight = 590;
let context;

let birdWidth = 34;
let birdHeight = 24;

let birdX;
let birdY;

let bird = {
	x: 0,
	y: 0,
	width: birdWidth,
	height: birdHeight
}

window.onload = function () {
	context = board.getContext("2d");
	board.height = boardHeight;
	board.width = boardWidth;

	birdX = boardWidth / 8;
	birdY = boardHeight / 2;
	bird.x = birdX;
	bird.y = birdY;

	birdImg = new Image();
	birdImg.src = "Image/Image/flappybird.png";
	birdImg.onload = function(){
		context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
	}

	requestAnimationFrame(update);
}

function update(){
	requestAnimationFrame(update);
	context.clearRect(0, 0, board.width, board.height);
	context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}
