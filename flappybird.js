let tg = window.Telegram.WebApp;
tg.expand();
let userName;

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

let board = document.getElementById("board");
let boardWidth = 420;
let boardHeight = 750;
let textValue;
let context;

let birdWidth = 48;
let birdHeight = 34;

let birdX;
let birdY;

let bird = {
	x: 0,
	y: 0,
	width: birdWidth,
	height: birdHeight,
	velocityY: 0,
	jumpForce: 1920 / screenHeight * 2, // Збільшено для однакового стрибка на різних пристроях
	gravity: 1920 / screenHeight / 10 // Збільшено для однакового падіння на різних пристроях
}

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let velocityX = -2;
let velocityY = 0;
//let gravity = screenHeight * 0.0003;

let gameOver = false;
let score = 0;

let lastTime = 0;

window.onload = function () {
	context = board.getContext("2d");
	//boardHeight = board.height;
	//boardWidth = board.width;
	board.height = boardHeight;
	board.width = boardWidth;

	try {
		tg.initDataUnsafe.user.id;
		userName = tg.initDataUnsafe.user.first_name + ", " + tg.initDataUnsafe.user.last_name;
	}
	catch (_) {
		userName = "";
	}
	textValue = userName;

	birdX = boardWidth / 8;
	birdY = boardHeight / 2;
	bird.x = birdX;
	bird.y = birdY;

	birdImg = new Image();
	birdImg.src = "Image/Image/flappybird.png";
	birdImg.onload = function () {
		context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
	}

	topPipeImg = new Image();
	topPipeImg.src = "Image/Image/toppipe.png"

	bottomPipeImg = new Image();
	bottomPipeImg.src = "Image/Image/bottompipe.png"

	requestAnimationFrame(update);
	setInterval(placePipes, 1000);
	document.addEventListener("touchstart", moveBird);
}

function update(timestamp) {
	if (!lastTime) {
		lastTime = timestamp;
	}
	const deltaTime = (timestamp - lastTime) / 10;
	lastTime = timestamp;

	requestAnimationFrame(update);

	if (gameOver) {
		return;
	}
	context.clearRect(0, 0, board.width, board.height);

	bird.velocityY += bird.gravity * deltaTime;
	bird.y += bird.velocityY;
	context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

	if (bird.y > board.height) {
		gameOver = true;
	}

	for (let i = 0; i < pipeArray.length; i++) {
		let pipe = pipeArray[i];
		pipe.x += velocityX * deltaTime;
		context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

		if (!pipe.passed && bird.x > pipe.x + pipe.width) {
			score += 0.5;
			pipe.passed = true;
		}

		if (detectCollision(bird, pipe)) {
			gameOver = true;
		}
	}

	while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
		pipeArray.shift();
	}

	context.fillStyle = "white";
	context.font = "45px sans-serif";
	context.fillText(score, 5, 45);

	if (gameOver) {
		textValue = "GAME OVER"
	}

	context.fillText(textValue, 5, 90);
}

function placePipes() {
	if (gameOver) {
		return;
	}

	let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
	let openingSpace = board.height / 4;

	let topPipe = {
		img: topPipeImg,
		x: pipeX,
		y: randomPipeY,
		width: pipeWidth,
		height: pipeHeight,
		passed: false
	}
	pipeArray.push(topPipe);

	let bottomPipe = {
		img: bottomPipeImg,
		x: pipeX,
		y: randomPipeY + pipeHeight + openingSpace,
		width: pipeWidth,
		height: pipeHeight,
		passed: false
	}
	pipeArray.push(bottomPipe);

}

function moveBird() {
	bird.velocityY = -bird.jumpForce;

	if (gameOver) {
		bird.y = birdY;
		pipeArray = [];
		score = 0;
		gameOver = false;
		textValue = userName;
	}
}

function detectCollision(a, b) {
	return a.x < b.x + b.width &&
		a.x + a.width > b.x &&
		a.y < b.y + b.height &&
		a.y + a.height > b.y;
}
