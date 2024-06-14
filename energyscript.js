var telegram = window.Telegram.WebApp;
var energyCount = 10;
var maxEnergyCount = 10;
var timeToReset = 10;
let lastActiveTime;
let timer = 0;
let lastFrameTime = Date.now();
var energyText = document.getElementById("energy-text");

document.addEventListener('DOMContentLoaded', function () {
	energyCount =  localStorage.getItem('energyCount') || maxEnergyCount;
	if (isNaN(energyCount)) {
		energyCount = maxEnergyCount;
	}

	maxEnergyCount = localStorage.getItem('maxEnergyCount', maxEnergyCount);
	lastActiveTime = parseInt(localStorage.getItem('lastActiveTime'), 10) || Date.now();

	console.log(energyCount);

	timer += Date.now() - lastActiveTime;
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
	}
	console.log(energyCount);
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
		console.log("OKKKKKK");
	}
	
	console.log(energyCount);

	lastFrameTime = Date.now();
	requestAnimationFrame(updateGame);
}

function updateLastActivity() {
	lastActiveTime = Date.now();
	localStorage.setItem('lastActiveTime', lastActiveTime);
}
