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

const birdImages = [
	"Image/Image/flappybird1.png",
	"Image/Image/flappybird2.png",
	"Image/Image/flappybird3.png"
];
const birdImg = new Image();
let currentFrame = 0;
const frameInterval = 200;

let birdWidth = 65;
let birdHeight = 40;

let birdX;
let birdY;
let bgX = 0;
let speed = -10;

let bird = {
	x: 0,
	y: 0,
	width: birdWidth,
	height: birdHeight,
	velocityY: 0,
	jumpForce: gridSquareY / (FPS * 1.6),
	gravity: gridSquareY / (FPS / 1.9),
	maxUpAngle: 10 * (Math.PI / 180),
	maxDownAngle: 20 * (Math.PI / 180)
};

let pipeArray = [];
let pipeWidth = 80;
let pipeHeight = 633;
let pipeX = boardWidth;
let pipeY = 0;
let openingSpace = 190;
let spaceBetweenPipes = 250;
let addingPipe = new Image();
addingPipe.src = "Image/Image/AddingPipe.png";
addingPipeWidth = pipeWidth / 1.0917;
aaddingPipeHeight = pipeHeight;

let topPipeImg;
let bottomPipeImg;

let velocityX = speed / FPS;
let velocityY = 0;

let gameOver = true;
var isPause = false;
let isAgree = JSON.parse(localStorage.getItem("isAgree")) || false;
let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
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
let gameScoreText = document.querySelector('.game-score');
let privacyPolicy = document.querySelector('.privacy-policy_block');
let buttons = document.querySelectorAll(".shop-tab, .referral-tab, .roadmap-tab");
let referralBlock = document.querySelector('.referral-info');
let inviteBlock = document.querySelector('.invite-info');
let referralReverseBtn = document.querySelector('.my-referral_btn');
let inviteReverseBtn = document.querySelector('.invite-block_btn');
let privacyBtn = document.querySelector('.policy-btn');

let index = 0;

let changes = {
	10: { speed: -11, bgSpeed: 1.1 },
	20: { openingSpace: 180 },
	30: { speed: -12, spaceBetweenPipes: 260, bgSpeed: 1.2 },
	40: { speed: -13, spaceBetweenPipes: 270, bgSpeed: 1.3 },
	50: { openingSpace: 170 },
	60: { speed: -14, spaceBetweenPipes: 280, bgSpeed: 1.4 },
	70: { speed: -15, spaceBetweenPipes: 290, bgSpeed: 1.5 },
	80: { speed: -16, spaceBetweenPipes: 300, bgSpeed: 1.6 },
	90: { speed: -17, spaceBetweenPipes: 310, bgSpeed: 1.7 },
	100: { openingSpace: 160 },
	110: { speed: -18, spaceBetweenPipes: 320, bgSpeed: 1.8 },
	120: { speed: -19, spaceBetweenPipes: 330, bgSpeed: 1.9 },
	130: { speed: -20, spaceBetweenPipes: 340, bgSpeed: 2 }
};


clicks();



window.onload = function () {
	preloader();


	context = board.getContext("2d");
	board.height = boardHeight;
	board.width = boardWidth;

	let mainButton = document.querySelector('.big-button');
	mainButton.addEventListener('click', restartGame);

	textValue = userName;

	birdX = boardWidth / 8;
	birdY = boardHeight / 3;
	bird.x = birdX;
	bird.y = birdY;
	birdImg.onload = function () {
		context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
	};

	topPipeImg = new Image();
	topPipeImg.src = "Image/Image/toppipe.png";

	bottomPipeImg = new Image();
	bottomPipeImg.src = "Image/Image/bottompipe.png";

	placePipes();

	if (isMobile) {
		document.addEventListener("touchstart", moveBird, { passive: true });
	} else {
		document.addEventListener("mousedown", moveBird, { passive: true });
	}

	if (!isAgree) {
		isPause = true;
		privacyPolicy.style.display = 'block';
	}

	totalScore += score;
	allPointerText.textContent = convertibleBalance(totalScore);
	pointerText.textContent = score;
	energyText.textContent = energyCount + '/' + maxEnergyCount;
	loadScore();
	createBackground();


	window.addEventListener('online', updateNetworkStatus);
	window.addEventListener('offline', updateNetworkStatus);
	updateNetworkStatus();
	setInterval(checkNetworkLatency, 5000);


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

	context.save();
	context.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
	context.rotate(calculateRotationAngle(bird.velocityY));
	context.drawImage(birdImg, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
	context.restore();

	if (bird.y > board.height) {
		died();
	} else if (bird.y < 0) {
		bird.velocityY = 0;
		bird.y = 5;
	}

	for (let i = 0; i < pipeArray.length; i++) {
		let pipe = pipeArray[i];
		pipe.x += velocityX * deltaTime * 1000;
		context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

		if (!pipe.passed && bird.x > pipe.x + pipe.width && !pipe.isAdding) {
			score += multiEarn / 2;

			const currentChange = changes[score / multiEarn];

			if (currentChange) {
				if (currentChange.speed !== undefined) {
					speed = currentChange.speed;
					console.log(speed);
				}
				if (currentChange.openingSpace !== undefined) {
					openingSpace = currentChange.openingSpace;
					console.log(openingSpace);
				}
				if (currentChange.spaceBetweenPipes !== undefined) {
					spaceBetweenPipes = currentChange.spaceBetweenPipes;
					console.log(spaceBetweenPipes);
				}
			}

			pipe.passed = true;
			gameScoreText.textContent = score;
		}

		if (detectCollision(bird, pipe)) {
			died();
		}
	}

	if (pipeArray.length == 0 || pipeArray[pipeArray.length - 1].x <= pipeX - spaceBetweenPipes) {
		placePipes();
	}

	while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
		pipeArray.shift();
	}
}



function preloader() {

	console.log("OK");
	const images = document.images;
	const totalImages = images.length;
	let imagesLoaded = 0;
	let progressText = document.querySelector(".loading-progress");
	let addingNumber = 100 / totalImages;
	let progress = 0;

	progressText.textContent = progress + "%";

	function imageLoaded() {
		imagesLoaded++;
		if (imagesLoaded === totalImages) {
			setTimeout(() => {
				document.querySelector(".preloader").style.display = "none";
				document.querySelector(".game").style.display = "block";
			}, 1000);
		}
	}

	for (let i = 0; i < totalImages; i++) {
		if (images[i].complete) {
			imageLoaded();
			console.log("OK");
			progress += addingNumber;
			progressText.textContent = Math.floor(progress) + "%";
		} else {
			images[i].addEventListener("load", imageLoaded);
			images[i].addEventListener("error", imageLoaded);
		}
	}

	if (totalImages === 0) {
		document.getElementById("preloader").style.display = "none";
		document.getElementById("app").style.display = "block";
	}
};



function died() {
	bird.velocityY = 0;

	document.querySelector('.button-container').style.display = 'flex';
	document.querySelector('.start-screen').style.display = 'block';
	gameScoreText.style.display = 'none';

	saveScore();
	bird.y = birdY;
	changeBalance(score, Math.floor(score / 60), "increment");
	allPointerText.textContent = convertibleBalance(totalScore);
	pointerText.textContent = score;
	gameScoreText.textContent = 0;
	stopMoving();
	gameOver = true;
	isPause = true;

	setTimeout(() => {
		isPause = false;
	}, 500);

	return;
}



function loadScore() {
	const savedScore = localStorage.getItem('totalScore');
	totalScore = savedScore ? parseInt(savedScore, 10) : 0;
	allPointerText.textContent = convertibleBalance(totalScore);
}



function loadImages(sources, callback) {
	let loadedImages = 0;
	let numImages = sources.length;
	let images = [];
	for (let i = 0; i < numImages; i++) {
		images[i] = new Image();
		images[i].src = sources[i];
		images[i].onload = function () {
			if (++loadedImages >= numImages) {
				callback(images);
			}
		};
	}
}

loadImages(birdImages, function (images) {
	birdImg.src = images[currentFrame].src;
	birdImg.onload = function () {
		context.rotate(calculateRotationAngle(bird.velocityY));
		context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
	};

	setInterval(() => {
		currentFrame = (currentFrame + 1) % birdImages.length;
		birdImg.src = images[currentFrame].src;
	}, frameInterval);
});



function calculateRotationAngle(velocityY) {
	if (velocityY > 0) {
		return Math.min(velocityY * 0.1, bird.maxUpAngle);
	} else {
		return Math.max(velocityY * 0.1, -bird.maxDownAngle);
	}
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



function hideAllTabs() {
	buttons.forEach(button => {
		button.classList.remove("toggled-style");
	});
}



function placePipes() {
	if (gameOver) {
		return;
	}

	let randomPipeY = pipeY - pipeHeight / 2.5 - Math.random() * (pipeHeight / 2);


	let topPipe = {
		img: topPipeImg,
		x: pipeX,
		y: randomPipeY,
		width: pipeWidth,
		height: pipeHeight,
		passed: false,
		isAdding: false
	};
	pipeArray.push(topPipe);

	let addingBottomPipe = {
		img: addingPipe,
		x: pipeX + 3.36,
		y: randomPipeY + pipeHeight + openingSpace + pipeHeight - 20,
		width: addingPipeWidth,
		height: aaddingPipeHeight,
		passed: false,
		isAdding: true
	};
	pipeArray.push(addingBottomPipe);

	let bottomPipe = {
		img: bottomPipeImg,
		x: pipeX,
		y: randomPipeY + pipeHeight + openingSpace,
		width: pipeWidth,
		height: pipeHeight,
		passed: false,
		isAdding: false
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
	if (typeof energyCount !== 'undefined' && energyCount > 0 && !isPause) {
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
		gameScoreText.style.display = 'block';
	} else if (energyCount == 0) {
		openChargeInfo();
	}
}



function toggleStyleAndShop(event) {
	if (!isPause) {
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
			index++
			if (referralPage.style.display == "none") {
				openPage(referralPage);
			} else {
				closePage(referralPage);
			}

			if (index === 10) {
				localStorage.clear();
			}
		} else {
			closePage(referralPage);
		}


		if (event.currentTarget.id === "roadmap-tab") {
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



function turnOnButton() {
	if (shop.style.display === "none" && referralPage.style.display == "none" && roadmapPage.style.display == "none") {
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
			allPointerText.textContent = convertibleBalance(totalScore);
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
		allPointerText.textContent = convertibleBalance(totalScore);
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

	chargeBlocks.forEach(function (chargeBlock) {
		chargeBlock.style.display = "block";
		setTimeout(function () {
			chargeBlock.style.opacity = "1";
		}, 10);

		setTimeout(function () {
			chargeBlock.style.opacity = "0";
			setTimeout(function () {
				chargeBlock.style.display = "none";
			}, 500);
		}, 2010);
	});
}



function convertibleBalance(count) {
	if (count < 10000) {
		return count.toString();
	} else if (count >= 10000 && count < 1000000) {
		let newCount = Math.floor(count / 100) / 10;
		return `${newCount.toFixed(1).replace('.0', '')}K`;
	} else if (count >= 1000000) {
		let newCount = Math.floor(count / 100000) / 10;
		return `${newCount.toFixed(1).replace('.0', '')}M`;
	}
}



function saveScore() {
	localStorage.setItem('totalScore', totalScore.toString());
}



function clearScore() {
	localStorage.clear();
}



function clicks() {
	document.getElementById("shop-tab").addEventListener("click", toggleStyleAndShop);
	document.getElementById("referral-tab").addEventListener("click", toggleStyleAndShop);
	document.getElementById("roadmap-tab").addEventListener("click", toggleStyleAndShop);
	document.getElementById("more-info_button").addEventListener("click", openChargeInfo);

	activeRegim.addEventListener("click", function () {
		dropdown.classList.toggle('hidden');
	});

	dropdownBtn.addEventListener('click', function () {
		dropdown.classList.toggle('hidden');
	});

	referralReverseBtn.addEventListener("click", function () {
		referralBlock.style.display = 'none';
		inviteBlock.style.display = 'block';
	});
	inviteReverseBtn.addEventListener("click", function () {
		referralBlock.style.display = 'block';
		inviteBlock.style.display = 'none';
	});

	if (!isAgree) {
		privacyPolicy.addEventListener("click", function () {
			privacyPolicy.style.display = 'none';
			isAgree = true;
			isPause = false;
			localStorage.setItem("isAgree", JSON.stringify(isAgree));
			start();
		});
	}
}



function updateNetworkStatus() {
	const networkStatus = document.getElementById("network-status");
	if (navigator.onLine) {
		networkStatus.classList.add("hidden");
	} else {
		networkStatus.classList.remove("hidden");
	}
}

function checkNetworkLatency() {
	const startTime = Date.now();
	fetch('https://maroowner.github.io/ping')
		.then(response => response.text())
		.then(() => {
			const latency = Date.now() - startTime;
			if (latency > 3000) {
				document.getElementById("network-status").classList.remove("hidden");
			} else {
				document.getElementById("network-status").classList.add("hidden");
			}
		})
		.catch(() => {
			document.getElementById("network-status").classList.remove("hidden");
		});
}



requestAnimationFrame(gameLoop);
