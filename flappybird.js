let tg = window.Telegram.WebApp;
tg.expand();
let userName;

const BASE_WIDTH = 800;
const BASE_HEIGHT = 600;

const currentWidth = window.innerWidth;
const currentHeight = window.innerHeight;

const scaleX = currentWidth / BASE_WIDTH;
const scaleY = currentHeight / BASE_HEIGHT;

const scale = Math.min(scaleX, scaleY);

function scaleValue(value) {
	return value * scale;
}

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

let board = document.getElementById("board");
let boardWidth = screenWidth;
let boardHeight = screenHeight;
let textValue;
let context;
let gridSquareY = scaleValue(80);
let gridSquareX = scaleValue(240);

let birdWidth = 48;
let birdHeight = 38;

let birdX;
let birdY;

let bird = {
	x: 0,
	y: 0,
	width: birdWidth,
	height: birdHeight,
	velocityY: 0,
	jumpForce: gridSquareY / 3,
	gravity: gridSquareY
}

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;
let topBgImg;
let bottomBgImg;

let velocityX = -3;
let velocityY = 0;

let gameOver = true;
let totalScore = 0;
let score = 0;
let pointerText = document.getElementById("pointer-text");
let allPointerText = document.getElementById("all-point_text");

let lastTime = 0;

window.onload = function () {
	context = board.getContext("2d");

	bottomBgImg = new Image();
	bottomBgImg.src = "Image/Image/BottomBackground@4x.png";
	topBgImg = new Image();
	topBgImg.src = "Image/Image/MainBackground@4x.png";

	board.height = boardHeight;
	board.width = boardWidth;

	let mainButton = document.querySelector('.main-button');
	mainButton.addEventListener('click', restartGame);

	try {
		tg.initDataUnsafe.user.id;
		userName = tg.initDataUnsafe.user.first_name + ", " + tg.initDataUnsafe.user.last_name;
	}
	catch (_) {
		userName = "";
	}
	textValue = userName;

	birdX = boardWidth / 8;
	birdY = boardHeight / 3;
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
	setInterval(placePipes, 1100);
	if (gameOver) {
		document.addEventListener("touchstart", moveBird);
	}
	totalScore += score;
	allPointerText.textContent = totalScore;
	pointerText.textContent = score;
	loadScore();
	dbManage();
}

function update(timestamp) {
	if (!lastTime) {
		lastTime = timestamp;
	}
	const deltaTime = (timestamp - lastTime) / 1000;
	lastTime = timestamp;

	context.clearRect(0, 0, board.width, board.height);
	context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
	requestAnimationFrame(update);
	drawStartInterface();
	if (gameOver) {
		bird.x = birdX;
		bird.y = birdY;
		return;
	}

	context.clearRect(0, 0, board.width, board.height);
	bird.velocityY += bird.gravity * deltaTime;
	bird.y += bird.velocityY;
	context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

	if (bird.y > board.height) {
		bird.velocityY = 0;
		document.querySelector('.button-container').style.display = 'flex';
		document.querySelector('.start-screen').style.display = 'block';
		saveScore();
		totalScore += score;
		allPointerText.textContent = totalScore;
		pointerText.textContent = score;
		gameOver = true;
	}

	for (let i = 0; i < pipeArray.length; i++) {
		let pipe = pipeArray[i];
		pipe.x += velocityX * deltaTime * 60;
		context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

		if (!pipe.passed && bird.x > pipe.x + pipe.width) {
			score += 0.5;
			pipe.passed = true;
		}

		if (detectCollision(bird, pipe)) {
			bird.velocityY = 0;
			document.querySelector('.button-container').style.display = 'flex';
			document.querySelector('.start-screen').style.display = 'block';
			totalScore += score;
			allPointerText.textContent = totalScore;
			saveScore();
			pointerText.textContent = score;
			gameOver = true;
		}
	}

	while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
		pipeArray.shift();
	}

	drawPlayInterface();
}

function loadScore() {
	const savedScore = localStorage.getItem('totalScore');
	totalScore = savedScore ? parseInt(savedScore, 10) : 0;
	allPointerText.textContent = totalScore;
}

function drawStartInterface() {
	context.drawImage(topBgImg, 0, 0, board.width, board.height);
}

function drawPlayInterface() {
	context.fillStyle = "white";
	context.font = "45px sans-serif";
	context.fillText(score, 5, 45);

	context.fillText(textValue, 5, 90);
}

function placePipes() {
	if (gameOver) {
		return;
	}

	let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
	let openingSpace = scaleValue(400);

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
}

function detectCollision(a, b) {
	return a.x < b.x + b.width &&
		a.x + a.width > b.x &&
		a.y < b.y + b.height &&
		a.y + a.height > b.y;
}

function restartGame() {
	bird.y = birdY;
	pipeArray = [];
	score = 0;
	gameOver = false;
	textValue = userName;
	document.querySelector('.button-container').style.display = 'none';
	document.querySelector('.start-screen').style.display = 'none';
}

function saveScore() {
	localStorage.setItem('totalScore', totalScore.toString());
}

function dbManage() {
	let points = 123124;
	let name = 'Doy Johnson'
	var xhr = new XMLHttpRequest();

	xhr.open("POST", "db_connect.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			console.log(xhr.responseText);
		}
	};

	xhr.send("points=" + points + "&name=" + name);
}
