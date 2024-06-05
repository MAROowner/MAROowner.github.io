let energyCount = 10;
let maxEnergyCount = 10;
let timeToReset = 600;
let inactiveTime;
let lastActiveTime;
let lastCharging;
let chargeTime;
let peaceChargeTime;
let energyText = document.getElementById("energy-text");

document.addEventListener('DOMContentLoaded', function () {
	energyCount = parseInt(localStorage.getItem('energyCount'), 10) || 10;
	lastActiveTime = parseInt(localStorage.getItem('lastActiveTime'), 10) || Date.now();
	timeToReset = parseInt(localStorage.getItem('timeToReset'), 10) || 600;
	maxEnergyCount = parseInt(localStorage.getItem('maxEnergyCount'), 10) || 10;

	inactiveTime = Math.floor((Date.now() - lastActiveTime) / 1000);

	if (inactiveTime >= timeToReset) {
		energyCount += Math.floor(inactiveTime / timeToReset);
		energyCount = Math.min(energyCount, maxEnergyCount);
		peaceChargeTime = inactiveTime - Math.floor(inactiveTime / timeToReset) * timeToReset;
	} else {
		peaceChargeTime = inactiveTime;
	}

	console.log(energyCount);
	energyText.textContent = energyCount;
	lastCharging = Date.now();
	requestAnimationFrame(update);
});

function update() {
	chargeTime = Math.floor((Date.now() - lastCharging) / 1000) + peaceChargeTime;

	if (chargeTime >= timeToReset) {
		if (energyCount < maxEnergyCount) {
			energyCount++;
			energyText.textContent = energyCount;
		}
		lastCharging = Date.now();
		peaceChargeTime = 0;
	}

	requestAnimationFrame(update);
}

function exit() {
	lastActiveTime = Date.now();
	localStorage.setItem('energyCount', energyCount);
	localStorage.setItem('lastActiveTime', lastActiveTime);
	localStorage.setItem('timeToReset', timeToReset);
	localStorage.setItem('maxEnergyCount', maxEnergyCount);
}

window.addEventListener('beforeunload', exit);