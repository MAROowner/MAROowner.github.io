var energyCount = 10;
var maxEnergyCount = 10;
var timeToReset = 10;
let inactiveTime;
let lastActiveTime;
let lastCharging;
let chargeTime;
let peaceChargeTime;
var energyText = document.getElementById("energy-text");

document.addEventListener('DOMContentLoaded', function () {
	var storedValue = localStorage.getItem('energyCount');
	energyCount = storedValue !== null ? parseInt(storedValue, 10) : 10;
	if (isNaN(energyCount)) {
		energyCount = 10;
	}

	lastActiveTime = parseInt(localStorage.getItem('lastActiveTime'), 10) || Date.now();
	timeToReset = parseInt(localStorage.getItem('timeToReset'), 10) || 10;
	maxEnergyCount = parseInt(localStorage.getItem('maxEnergyCount'), 10) || 10;

	inactiveTime = Math.floor((Date.now() - lastActiveTime) / 1000);

	console.log(inactiveTime);

	if (inactiveTime >= timeToReset) {
		energyCount += Math.floor(inactiveTime / timeToReset);
		energyCount = Math.min(energyCount, maxEnergyCount);
		peaceChargeTime = inactiveTime - Math.floor(inactiveTime / timeToReset) * timeToReset;
	} else {
		peaceChargeTime = inactiveTime;
	}

	energyText.textContent = energyCount;
	lastCharging = Date.now();
	updateGame();
});

function updateGame() {
	chargeTime = Math.floor((Date.now() - lastCharging) / 1000) + peaceChargeTime;

	if (chargeTime >= timeToReset) {
		if (energyCount < maxEnergyCount) {
			energyCount++;
			energyText.textContent = energyCount;
		}
		lastCharging = Date.now();
		peaceChargeTime = 0;
	}
	requestAnimationFrame(updateGame);
}

function handleAppClose() {
	console.log('Додаток закривається');
	energyCount = maxEnergyCount;
	localStorage.setItem('energyCount', energyCount);
}

tg.onEvent('viewportChanged', function() {
	if (document.hidden) {
		 handleAppClose();
	}
});
