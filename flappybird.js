let tg = window.Telegram.WebApp;
tg.expand();
let userName;

const FPS = 60;
const frameDuration = 1000 / FPS;
let lastTime = 0;

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

let board = document.getElementById("board");
let boardWidth = screenWidth;
let boardHeight = screenHeight;
let textValue;
let context;
let gridSquareY = 1000;

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
	jumpForce: gridSquareY / (FPS * 2),
	gravity: gridSquareY / (FPS / 1.3)
};

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;
let topBgImg;
let bottomBgImg;

let velocityX = -8 / FPS;
let velocityY = 0;

let gameOver = true;
var multiEarn;
var totalScore = 0;
let score = 0;
let pointerText = document.getElementById("pointer-text");
var allPointerText = document.getElementById("all-point_text");

window.onload = function () {
	context = board.getContext("2d");

	bottomBgImg = new Image();
	bottomBgImg.src = "Image/Image/BottomBackground@4x.png";
	topBgImg = new Image();
	topBgImg.src = "Image/Image/MainBackground@4x.png";

	board.height = boardHeight;
	board.width = boardWidth;

	let mainButton = document.querySelector('.main-button');
	let shopButton = document.querySelector('.second-button_1');
	let exitButton = document.querySelector('.exit-button');
	mainButton.addEventListener('click', restartGame);
	shopButton.addEventListener('click', openShop);
	exitButton.addEventListener('click', closeShop);

	try {
		tg.initDataUnsafe.user.id;
		userName = tg.initDataUnsafe.user.first_name + " " + tg.initDataUnsafe.user.last_name;
	} catch (_) {
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
	};

	topPipeImg = new Image();
	topPipeImg.src = "Image/Image/toppipe.png";

	bottomPipeImg = new Image();
	bottomPipeImg.src = "Image/Image/bottompipe.png";

	requestAnimationFrame(gameLoop);
	//setInterval(placePipes, 1100);
	placePipes();

	document.addEventListener("touchstart", moveBird);

	totalScore += score;
	allPointerText.textContent = totalScore;
	pointerText.textContent = score;
	loadScore();
	dbManage();
};

function gameLoop(currentTime) {
	// Розрахуй час, що минув з останнього кадру
	const deltaTime = currentTime - lastTime;

	// Якщо минуло достатньо часу для нового кадру
	if (deltaTime >= frameDuration) {
		// Онови час останнього кадру
		lastTime = currentTime - (deltaTime % frameDuration);

		// Онови стан гри з урахуванням фіксованого deltaTime
		update(frameDuration / 1000);
	}

	// Запусти наступний кадр
	requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
	if (gameOver) {
		context.clearRect(0, 0, board.width, board.height);
		context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
		drawStartInterface();
		return;
	}

	context.clearRect(0, 0, board.width, board.height);

	// Онови стан пташки
	bird.velocityY += bird.gravity * deltaTime;
	bird.y += bird.velocityY;
	context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

	// Перевірка чи пташка не виходить за межі
	if (bird.y > board.height) {
		bird.velocityY = 0;
		document.querySelector('.button-container').style.display = 'flex';
		document.querySelector('.start-screen').style.display = 'block';
		saveScore();
		totalScore += score;
		allPointerText.textContent = totalScore;
		pointerText.textContent = score;
		gameOver = true;
		return;
	}

	// Онови труби
	for (let i = 0; i < pipeArray.length; i++) {
		let pipe = pipeArray[i];
		pipe.x += velocityX * deltaTime * 1000;
		context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

		if (!pipe.passed && bird.x > pipe.x + pipe.width) {
			score += multiEarn / 2;
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
			return;
		}
	}

	if (pipeArray.length == 0 || pipeArray[pipeArray.length - 1].x <= pipeX - 250) {
		placePipes();
	}

	// Видали труби, які вийшли за межі екрану
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

function openShop(){
	document.querySelector('.button-container').style.display = 'none';
	document.querySelector('.shop').style.display = 'block';
}

function closeShop(){
	document.querySelector('.button-container').style.display = 'flex';
	document.querySelector('.shop').style.display = 'none';
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
	let openingSpace = 170;

	let topPipe = {
		img: topPipeImg,
		x: pipeX,
		y: randomPipeY,
		width: pipeWidth,
		height: pipeHeight,
		passed: false
	};
	pipeArray.push(topPipe);

	let bottomPipe = {
		img: bottomPipeImg,
		x: pipeX,
		y: randomPipeY + pipeHeight + openingSpace,
		width: pipeWidth,
		height: pipeHeight,
		passed: false
	};
	pipeArray.push(bottomPipe);
}

function moveBird() {
	if (!gameOver) {
		bird.velocityY = -bird.jumpForce;
	}
}

function detectCollision(a, b) {
	return a.x < b.x + b.width &&
		a.x + a.width > b.x &&
		a.y < b.y + b.height &&
		a.y + a.height > b.y;
}

function restartGame() {
	if (typeof energyCount !== 'undefined' && energyCount > 0) {
		energyCount -= 1;
		energyText.textContent = energyCount;
		localStorage.setItem('energyCount', energyCount);
		bird.y = birdY;
		pipeArray = [];
		score = 0;
		gameOver = false;
		textValue = userName;
		document.querySelector('.button-container').style.display = 'none';
		document.querySelector('.start-screen').style.display = 'none';
	}
}

function saveScore() {
	localStorage.setItem('totalScore', totalScore.toString());
}

function dbManage() {
	let points = 123124;
	let name = 'Doy Johnson';
	var xhr = new XMLHttpRequest();

	xhr.open("POST", "db_connect.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			console.log(xhr.responseText);
		}
	};

	//xhr.send("points=" + points + "&name=" + encodeURIComponent(name));
}

requestAnimationFrame(gameLoop);
