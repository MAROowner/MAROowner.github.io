var telegram = window.Telegram.WebApp;
var energyCount = 10;
var maxEnergyCount = 10;
var timeToReset = 10;
let lastActiveTime;
let timer = 0;
let lastFrameTime = Date.now();
var energyText = document.getElementById("energy-text");

document.addEventListener('DOMContentLoaded', function () {
	energyCount =  parseInt(localStorage.getItem('energyCount'), 10) || maxEnergyCount;
	if (isNaN(energyCount)) {
		energyCount = maxEnergyCount;
	}

	maxEnergyCount = localStorage.getItem('maxEnergyCount', maxEnergyCount);
	lastActiveTime = parseInt(localStorage.getItem('lastActiveTime'), 10) || Date.now();

	console.log(energyCount);

	timer += Date.now() - lastActiveTime;
	console.log(timer);
	
	if (Math.floor(timer / 1000) >= timeToReset) {
		console.log("time:" + timeToReset);
		console.log(Math.floor(timer / 1000));
		if (energyCount < maxEnergyCount) {
			console.log(">");
			let addingChargeCount = Math.floor(Math.floor(timer / 1000) / timeToReset);

			console.log(Math.floor(timer / 1000))
			console.log((Math.floor(timer / 1000) / timeToReset));
			console.log(Math.floor(Math.floor(timer / 1000) / timeToReset));

			console.log("Add: " + addingChargeCount);

			if(energyCount + addingChargeCount < maxEnergyCount){
				energyCount += addingChargeCount;
				console.log("afterAdding " + energyCount)
				timer -= (addingChargeCount * timeToReset) * 1000;
				console.log("timer " + timer);
			}else{
				energyCount = maxEnergyCount;
				console.log('Max');
				timer = 0;
			}

			localStorage.setItem('energyCount', energyCount);
			console.log("actual energy count: " + energyCount);
		}else{
			timer = 0;
			console.log("<");
		}

		updateLastActivity();
		energyText.textContent = energyCount + '/' + maxEnergyCount;
	}

	console.log(energyCount);
	energyText.textContent = energyCount + '/' + maxEnergyCount;
	updateGame();
});

function updateGame() {
	timer += Date.now() - lastFrameTime;

	addChargeCount();

	lastFrameTime = Date.now();
	requestAnimationFrame(updateGame);
}

function addChargeCount(){
	if (Math.floor(timer / 1000) >= timeToReset) {
		if (energyCount < maxEnergyCount) {
			let addingChargeCount = Math.floor(Math.floor(timer / 1000) / timeToReset);


			if(energyCount + addingChargeCount < maxEnergyCount){
				energyCount += addingChargeCount;
				timer -= (addingChargeCount * timeToReset) * 1000;
			}else{
				energyCount = maxEnergyCount;
				timer = 0;
			}

			localStorage.setItem('energyCount', energyCount);
			console.log("actual energy count: " + energyCount);
		}else{
			timer = 0;
		}

		updateLastActivity();
		energyText.textContent = energyCount + '/' + maxEnergyCount;
	}
}

function updateLastActivity() {
	lastActiveTime = Date.now();
	localStorage.setItem('lastActiveTime', lastActiveTime);
}
