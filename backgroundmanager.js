let layers = [];
let speedsBeforeGame = [0, 0.2, 0.3, 0.1, 0.4, 0];
let speedsAfterGame = [0.2, 0.6, 0.9, 0.3, 1.2, 0.5]

const cloudImg = new Image();
const cloud1Img = new Image();
const cloud2Img = new Image();
const cloud3Img = new Image();
const farImg = new Image();
const nearImg = new Image();

class Layer {
	constructor(image, speedModifier) {
		this.image = image;
		this.speedModifier = speedModifier;
		this.width = boardHeight * 1.777;
		this.height = boardHeight;
		this.x = 0;
		this.y = 0;
		this.speed = 2 * this.speedModifier;
	}

	update() {
		this.x -= this.speed;
		if (this.x <= -this.width) {
			this.x = 0;
		}
	}

	draw() {
		if (this.image == farImg || this.image == nearImg) {
			context.drawImage(this.image, this.x, this.y, this.width + 2, this.height);
			context.drawImage(this.image, this.x + this.width, this.y, this.width + 2, this.height);
		} else {
			context.drawImage(this.image, this.x, this.y, this.width, this.height);
			context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
		}

	}
}

function createBackground() {
	cloudImg.src = 'Image/Image/game_background_1/layers/clouds_2.png';
	cloud1Img.src = 'Image/Image/game_background_1/layers/clouds_1.png';
	cloud2Img.src = 'Image/Image/game_background_1/layers/clouds_3.png';
	cloud3Img.src = 'Image/Image/game_background_1/layers/clouds_4.png';
	farImg.src = 'Image/Image/game_background_1/layers/rocks_1.png';
	nearImg.src = 'Image/Image/game_background_1/layers/rocks_2.png';

	layers = [
		new Layer(farImg, 0),
		new Layer(cloudImg, 0.3),
		new Layer(cloud1Img, 0.4),
		new Layer(cloud2Img, 0.2),
		new Layer(cloud3Img, 0.5),
		new Layer(nearImg, 0)
	];
}

function updateBackground() {
	layers.forEach(layer => {
		layer.update();
		layer.draw(context);
	});
}

function startMoving() {
	for (let i = 0; i < layers.length; i++) {
		layers[i].speed = speedsAfterGame[i];
	}
}

function stopMoving() {
	for (let i = 0; i < layers.length; i++) {
		layers[i].speed = speedsBeforeGame[i];
	}
}