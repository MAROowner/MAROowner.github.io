let maxEnergyCountPrice = [100, 250, 1250, 5500, 10000, 23000, 55500, 100500];
let chargeSpeedPrice = [100, 250, 1250, 5500, 10000, 23000, 55500, 100500];
let multiEarnPrice = [100, 250, 1250, 5500, 10000, 23000, 55500, 100500];

let maxEnergyCountValue = [10, 12, 14, 16, 18, 20, 22, 24, 27, 30];
let chargeSpeedValue = [1800, 1680, 1560, 1440, 1320, 1200, 1080, 960, 780, 600];
let multiEarnValue = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

let maxEnergyCountLvl;
let chargeSpeedLvl;
let multiEarnLvl;

let maxEnergyCountText = document.getElementById("energy-price_text");
let chargeSpeedText = document.getElementById("charge-price_text");
let multiEarnText = document.getElementById("earn-price_text");

let maxEnergyCountInfoText = document.getElementById("energy-info_text");
let chargeSpeedInfoText = document.getElementById("charge-info_text");
let multiEarnInfoText = document.getElementById("earn-info_text");

/*let maxEnergyCountBtn = document.getElementById("max-energy_button");
let chargeSpeedBtn = document.getElementById("charge-speed_button");
let multiEarnBtn = document.getElementById("multi-earn_button");*/



/*maxEnergyCountBtn.addEventListener('click', buyMaxEnergy);
chargeSpeedBtn.addEventListener('click', buyChargeSpeed);
multiEarnBtn.addEventListener('click', buyMultiEarn);*/


document.addEventListener('DOMContentLoaded', function () {
	maxEnergyCountLvl = localStorage.getItem('maxEnergyCountLvl', 10) || 0;
	chargeSpeedLvl = localStorage.getItem('chargeSpeedLvl', 10) || 0;
	multiEarnLvl = localStorage.getItem('multiEarnLvl', 10) || 0;

	maxEnergyCountText.textContent = maxEnergyCountPrice[maxEnergyCountLvl];
	chargeSpeedText.textContent = chargeSpeedPrice[chargeSpeedLvl];
	multiEarnText.textContent = multiEarnPrice[multiEarnLvl];

	if (maxEnergyCountLvl == 9) {
		maxEnergyCountText.textContent = 'Max';
	}
	if (chargeSpeedLvl == 9) {
		chargeSpeedText.textContent = 'Max';
	}
	if (multiEarnLvl == 9) {
		multiEarnText.textContent = 'Max';
	}

	/*timeToReset = parseInt(localStorage.getItem('timeToReset'), 10) || 10;
	maxEnergyCount = parseInt(localStorage.getItem('maxEnergyCount'), 10) || 10;*/

	maxEnergyCount = maxEnergyCountValue[maxEnergyCountLvl];
	timeToReset = chargeSpeedValue[chargeSpeedLvl];
	multiEarn = multiEarnValue[multiEarnLvl];

	maxEnergyCountInfoText.textContent = maxEnergyCountLvl + " Lvl" + " • " + maxEnergyCount;
	chargeSpeedInfoText.textContent = chargeSpeedLvl + " Lvl" + " • " + Math.floor(timeToReset/60);
	multiEarnInfoText.textContent = multiEarnLvl + " Lvl" + " • " + multiEarn;
});

function buyMaxEnergy() {
	if (totalScore >= maxEnergyCountPrice[maxEnergyCountLvl] && maxEnergyCountLvl != 9) {
		totalScore -= maxEnergyCountPrice[maxEnergyCountLvl];
		maxEnergyCountLvl++;

		maxEnergyCountText.textContent = maxEnergyCountPrice[maxEnergyCountLvl];
		maxEnergyCount = maxEnergyCountValue[maxEnergyCountLvl];

		allPointerText.textContent = totalScore;
		energyText.textContent = energyCount + '/' + maxEnergyCount;
		localStorage.setItem('totalScore', totalScore.toString());
		localStorage.setItem('maxEnergyCountLvl', maxEnergyCountLvl);
		localStorage.setItem('maxEnergyCount', maxEnergyCount);
	}
}

function buyChargeSpeed() {
	if (totalScore >= chargeSpeedPrice[chargeSpeedLvl] && chargeSpeedLvl != 9) {
		totalScore -= chargeSpeedPrice[chargeSpeedLvl];
		chargeSpeedLvl++;

		chargeSpeedText.textContent = chargeSpeedPrice[chargeSpeedLvl];
		timeToReset = chargeSpeedValue[chargeSpeedLvl];

		allPointerText.textContent = totalScore;
		localStorage.setItem('totalScore', totalScore.toString());
		localStorage.setItem('chargeSpeedLvl', chargeSpeedLvl);
		localStorage.setItem('timeToReset', timeToReset);
	}
}

function buyMultiEarn() {
	if (totalScore >= multiEarnPrice[multiEarnLvl] && multiEarnLvl != 9) {
		totalScore -= multiEarnPrice[multiEarnLvl];
		multiEarnLvl++;

		multiEarnText.textContent = multiEarnPrice[multiEarnLvl];
		multiEarn = multiEarnValue[multiEarnLvl];

		allPointerText.textContent = totalScore;
		localStorage.setItem('totalScore', totalScore.toString());
		localStorage.setItem('multiEarnLvl', multiEarnLvl);
	}
}
