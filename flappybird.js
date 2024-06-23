var tg = window.Telegram.WebApp;
tg.expand();
tg.setHeaderColor('#62C4DA');
let userName;

const FPS = 60;
const frameDuration = 1000 / FPS;
let lastTime = 0;

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

var board = document.getElementById("board");
let boardWidth = screenWidth;
var boardHeight = screenHeight;
var textValue;
let gridSquareY = 1000;

let birdWidth = 50;
let birdHeight = 40;

let birdX;
let birdY;

let bird = {
	x: 0,
	y: 0,
	width: birdWidth,
	height: birdHeight,
	velocityY: 0,
	jumpForce: gridSquareY / (FPS * 1.7),
	gravity: gridSquareY / (FPS / 1.7)
};

let pipeArray = [];
let pipeWidth = 80;
let pipeHeight = 633;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;
let topBgImg;
let bottomBgImg;

let velocityX = -12 / FPS;
let velocityY = 0;

let gameOver = true;
let isReward = false;
var multiEarn;
var totalScore = 0;
let score = 0;

let pointerText = document.getElementById("pointer-text");
var allPointerText = document.getElementById("all-point_text");
let timerText = document.querySelector(".more-info_timer");
let shop = document.querySelector('.shop');
let referralPage = document.querySelector('.referral');
let roadmapPage = document.querySelector('.roadmap');
let dropdownBtn = document.querySelector('.regim-btn');
let dropdown = document.querySelector('.dropdown-list');
let activeRegim = document.querySelector('.options.active');

let bgImage = new Image();
bgImage.src = 'Image/Image/flappybirdbg.png';
let bgX = 0;
let speed = 2;

let name = 'Doy Johnson';
let points = 123124;
let buttons = document.querySelectorAll(".shop-tab, .referral-tab, .roadmap-tab");

let referralBlock = document.querySelector('.referral-info');
let inviteBlock = document.querySelector('.invite-info');
let referralReverseBtn = document.querySelector('.my-referral_btn');
let inviteReverseBtn = document.querySelector('.invite-block_btn');

let index = 0;


clicks();


window.onload = function () {
	context = board.getContext("2d");
	bottomBgImg = new Image();
	bottomBgImg.src = "Image/Image/BottomBackground@4x.png";

	board.height = boardHeight;
	board.width = boardWidth;

	let mainButton = document.querySelector('.big-button');
	mainButton.addEventListener('click', restartGame);

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

	placePipes();

	document.addEventListener("touchstart", moveBird);

	totalScore += score;
	allPointerText.textContent = totalScore;
	pointerText.textContent = 1;
	energyText.textContent = energyCount + '/' + maxEnergyCount;
	loadScore();
	createBackground();
	addRecord('Vesfix I Love You', 162);
	requestAnimationFrame(gameLoop);
};

function gameLoop(currentTime) {
	const deltaTime = currentTime - lastTime;

	if (deltaTime >= frameDuration) {
		lastTime = currentTime - (deltaTime % frameDuration);

		update(frameDuration / 1000);
	}

	requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
	if (gameOver) {
		context.clearRect(0, 0, board.width, board.height);
		updateBackground();
		context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
		return;
	}

	context.clearRect(0, 0, board.width, board.height);
	updateBackground();
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
		bird.y = birdY;
		stopMoving();
		gameOver = true;
		return;
	}

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
			stopMoving();
		   bird.y = birdY;
			gameOver = true;
			return;
		}
	}

	if (pipeArray.length == 0 || pipeArray[pipeArray.length - 1].x <= pipeX - 250) {
		placePipes();
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

function openPage(page) {
	document.querySelector('.main-button').style.display = 'none';
	pointerText.style.display = 'none';
	page.style.display = 'block';
	page.classList.add("open");
}

function closePage(page) {
   page.classList.remove('open');
	page.style.zIndex = 0;
   setTimeout(() => {
      page.style.display = 'none';
		turnOnButton();
		page.style.zIndex = 1;
   }, 200);
}

function hideAllTabs(){
	buttons.forEach(button => {
		button.classList.remove("toggled-style");
	});
}

function drawPlayInterface() {
	context.fillStyle = "black";
	context.font = "700 45px Gill Sans MT";
	context.fillText(score, board.width/2.2, board.height/10);
}

function placePipes() {
	if (gameOver) {
		return;
	}

	let randomPipeY = pipeY - pipeHeight / 2.5 - Math.random() * (pipeHeight / 2);
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
		energyText.textContent = energyCount + '/' + maxEnergyCount;
		localStorage.setItem('energyCount', energyCount);
		startMoving();
		bird.y = birdY;
		pipeArray = [];
		score = 0;
		gameOver = false;
		document.querySelector('.button-container').style.display = 'none';
		document.querySelector('.start-screen').style.display = 'none';
	}
}

function toggleStyleAndShop(event) {
	if(!isReward){
		buttons.forEach(button => {
			if (button !== event.currentTarget) {
				button.classList.remove("toggled-style");
			}
		});
	
		event.currentTarget.classList.toggle("toggled-style");
	
		if (event.currentTarget.id === "shop-tab") {
			if (shop.style.display === "none") {
				openPage(shop);
			} else {
				closePage(shop);
			}
		} else {
			closePage(shop);
		}
	
	
		if (event.currentTarget.id === "referral-tab") {
			if (referralPage.style.display == "none") {
				openPage(referralPage);
			} else {
				closePage(referralPage);
			}
		} else {
			closePage(referralPage);
		}
	
	
		if (event.currentTarget.id === "roadmap-tab"){
			if (roadmapPage.style.display == "none") {
				openPage(roadmapPage);
			} else {
				closePage(roadmapPage);
			}
		} else {
			closePage(roadmapPage);
		}
	}
}

function turnOnButton(){
	if(shop.style.display === "none" && referralPage.style.display == "none" && roadmapPage.style.display == "none"){
		document.querySelector('.main-button').style.display = 'flex';
		pointerText.style.display = 'block';
	}
}

function changeBalance(amount, incrementDecrementValue, operation) {
	const interval = 10;
	let startScore = totalScore;
	price = amount;

	if (incrementDecrementValue == 0) {
		 incrementDecrementValue = 1;
	}

	const incrementDecrementInterval = setInterval(() => {
		 if ((operation === 'decrement' && (amount <= 0 || totalScore <= 0)) || (operation === 'increment' && amount <= 0)) {
			  clearInterval(incrementDecrementInterval);
			  totalScore = operation === 'decrement' ? startScore - price : startScore + price;
			  allPointerText.textContent = totalScore;
			  localStorage.setItem('totalScore', totalScore.toString());
			  return;
		 }
		 if (operation === 'decrement') {
			  totalScore -= incrementDecrementValue;
			  amount -= incrementDecrementValue;
		 } else if (operation === 'increment') {
			  totalScore += incrementDecrementValue;
			  amount -= incrementDecrementValue;
		 }
		 allPointerText.textContent = totalScore;
	}, interval);
}

function openChargeInfo() {
	let chargeBlocks = document.querySelectorAll(".energy-more_info");

	let remainingTime = (timeToReset * 1000) - timer;

	let minutes = Math.floor(remainingTime / 1000 / 60);
	let seconds = Math.floor((remainingTime / 1000) % 60);

	if (seconds < 10) {
		timerText.textContent = minutes + ":0" + seconds;
	} else {
   	timerText.textContent = minutes + ":" + seconds;
	}

	chargeBlocks.forEach(function(chargeBlock) {
		 chargeBlock.style.display = "block"; 
		 setTimeout(function() {
			  chargeBlock.style.opacity = "1";
		 }, 10);

		 setTimeout(function() {
			  chargeBlock.style.opacity = "0";
			  setTimeout(function() {
					chargeBlock.style.display = "none";
			  }, 500);
		 }, 2010);
	});
}

function saveScore() {
	localStorage.setItem('totalScore', totalScore.toString());
}

function clearScore(){
	localStorage.clear();
}

function clicks(){
	document.getElementById("shop-tab").addEventListener("click", toggleStyleAndShop);
	document.getElementById("referral-tab").addEventListener("click", toggleStyleAndShop);
	document.getElementById("roadmap-tab").addEventListener("click", toggleStyleAndShop);
	document.getElementById("more-info_button").addEventListener("click", openChargeInfo);

	activeRegim.addEventListener("click", function(){
		dropdown.classList.toggle('hidden');
	});

	dropdownBtn.addEventListener('click', function() {
		dropdown.classList.toggle('hidden');
	});

	referralReverseBtn.addEventListener("click", function(){
		referralBlock.style.display = 'none';
		inviteBlock.style.display = 'block';
	});
	inviteReverseBtn.addEventListener("click", function(){
		referralBlock.style.display = 'block';
		inviteBlock.style.display = 'none';
	});
}

function addRecord(userName, points) {
	console.log(userName);
	console.log(points);
	const data = new FormData();
	data.append('name', userName);
	data.append('points', points);

	fetch('https://flappybirdproject-fb32e033fcc0.herokuapp.com/db_connect.php', {
		method: 'POST',
		body: data
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok ' + response.statusText);
			}
			return response.text();
		})
		.then(text => {
			try {
				const result = JSON.parse(text);
				console.log(result.message);
				if (result.success) {
					console.log('Новий запис успішно додано до бази даних');
				} else {
					console.log('Помилка:', result.message);
				}
			} catch (error) {
				console.error('JSON parse error:', error);
				console.log('Response text was:', text);
			}
		})
		.catch(error => console.error('Fetch error:', error));
}

requestAnimationFrame(gameLoop);
