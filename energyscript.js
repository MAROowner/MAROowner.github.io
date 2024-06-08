var telegram = window.Telegram.WebApp;
var energyCount = 10;
var maxEnergyCount = 10;
var timeToReset = 10;
let lastActiveTime;
let timer = 0;
let lastFrameTime = Date.now();
var energyText = document.getElementById("energy-text");


document.addEventListener("touchstart", updateLastActivity);

document.addEventListener('DOMContentLoaded', function () {
	var storedValue = localStorage.getItem('energyCount');
	energyCount = storedValue !== null ? parseInt(storedValue, 10) : maxEnergyCount;
	if (isNaN(energyCount)) {
		energyCount = maxEnergyCount;
	}


	lastActiveTime = parseInt(localStorage.getItem('lastActiveTime'), 10) || Date.now();
	timeToReset = parseInt(localStorage.getItem('timeToReset'), 10) || 10;
	maxEnergyCount = parseInt(localStorage.getItem('maxEnergyCount'), 10) || 10;

	timer += Date.now() - lastActiveTime;
	energyText.textContent = energyCount;
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
		energyText.textContent = energyCount;
	}

	lastFrameTime = Date.now();
	requestAnimationFrame(updateGame);
}

function updateLastActivity() {
	lastActiveTime = Date.now();
	localStorage.setItem('lastActiveTime', lastActiveTime);
}
