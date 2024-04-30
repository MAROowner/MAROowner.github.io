let board = document.getElementById("board");
let boardWidth = board.width;
let boardHeight = board.height;
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

	birdX = birdHeight / 8;
	birdY = birdWidth / 2;
	bird.x = birdX;
	bird.y = birdY;

	context.fillStyle = "green";
	context.fillRect(bird.x, bird.y, bird.width, bird.height);
}
