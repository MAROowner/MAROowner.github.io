var telegram = window.Telegram.WebApp;
var energyCount = 10;
var maxEnergyCount = 10;
var timeToReset = 10;
let lastActiveTime;
let timer = 0;
let lastFrameTime = Date.now();
var energyText = document.getElementById("energy-text");

document.addEventListener('DOMContentLoaded', function () {
	var storedValue = localStorage.getItem('energyCount');
	energyCount = storedValue !== null ? parseInt(storedValue, 10) : maxEnergyCount;
	if (isNaN(energyCount)) {
		energyCount = maxEnergyCount;
	}


	lastActiveTime = parseInt(localStorage.getItem('lastActiveTime'), 10) || Date.now();

	timer += Date.now() - lastActiveTime;
	energyText.textContent = energyCount + '/' + maxEnergyCount;
	updateGame();
});

function updateGame() {
	timer += Date.now() - lastFrameTime;

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
		}else{
			timer = 0;
		}

		updateLastActivity();
		energyText.textContent = energyCount + '/' + maxEnergyCount;
	}

	lastFrameTime = Date.now();
	requestAnimationFrame(updateGame);
}

function updateLastActivity() {
	lastActiveTime = Date.now();
	localStorage.setItem('lastActiveTime', lastActiveTime);
}
