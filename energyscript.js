var telegram = window.Telegram.WebApp;
var energyCount = 5;
var maxEnergyCount = 5;
var timeToReset = 10;
let lastActiveTime;
let timer = 0;
let lastFrameTime = Date.now();
var energyText = document.getElementById("energy-text");

document.addEventListener('DOMContentLoaded', function () {
	energyCount =  parseInt(localStorage.getItem('energyCount'), 5);
	if (isNaN(energyCount)) {
		energyCount = maxEnergyCount;
	}

	console.log(energyCount);

	timeToReset = localStorage.getItem('timeToReset', timeToReset) || 1800;
	maxEnergyCount = localStorage.getItem('maxEnergyCount', maxEnergyCount) || 5;
	lastActiveTime = parseInt(localStorage.getItem('lastActiveTime'), 10) || Date.now();
	if(lastActiveTime == Date.now()){
		updateLastActivity();
	}

	timer += Date.now() - lastActiveTime;
	console.log(timer);

	addChargeCount();
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
				let addingChargeCount = Math.floor(Math.floor(timer / 1000) / timeToReset);
				timer -= (addingChargeCount * timeToReset) * 1000;
			}

			localStorage.setItem('energyCount', energyCount);
		}else{
			let addingChargeCount = Math.floor(Math.floor(timer / 1000) / timeToReset);
			timer -= (addingChargeCount * timeToReset) * 1000;
		}

		updateLastActivity();
		energyText.textContent = energyCount + '/' + maxEnergyCount;
	}
}

function updateLastActivity() {
	lastActiveTime = Date.now();
	localStorage.setItem('lastActiveTime', lastActiveTime);
}
