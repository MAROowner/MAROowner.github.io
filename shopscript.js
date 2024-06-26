let maxEnergyCountPrice = [100, 250, 550, 1250, 2500, 5500, 9000, 12500, 19555];
let chargeSpeedPrice = [100, 250, 550, 1250, 2500, 5500, 9000, 12500, 19555];
let multiEarnPrice = [100, 250, 550, 1250, 2500, 5500, 9000, 12500, 19555];

let maxEnergyCountValue = [5, 7, 9, 10, 11, 12, 13, 14, 15, 16];
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

let maxEnergyCountBtn = document.getElementById("energy-product");
let chargeSpeedBtn = document.getElementById("charge-product");
let multiEarnBtn = document.getElementById("earn-product");


maxEnergyCountBtn.addEventListener('click', function () {
	buyConfirm(buyMaxEnergy);
});

chargeSpeedBtn.addEventListener('click', function () {
	buyConfirm(buyChargeSpeed);
});

multiEarnBtn.addEventListener('click', function () {
	buyConfirm(buyMultiEarn);
});


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

	maxEnergyCount = maxEnergyCountValue[maxEnergyCountLvl];
	timeToReset = chargeSpeedValue[chargeSpeedLvl];
	multiEarn = multiEarnValue[multiEarnLvl];

	maxEnergyCountInfoText.textContent = maxEnergyCountLvl + " Lvl" + " • " + maxEnergyCount;
	chargeSpeedInfoText.textContent = chargeSpeedLvl + " Lvl" + " • " + Math.floor(timeToReset / 60);
	multiEarnInfoText.textContent = multiEarnLvl + " Lvl" + " • " + multiEarn;
});

function buyMaxEnergy() {
	if (totalScore >= maxEnergyCountPrice[maxEnergyCountLvl] && maxEnergyCountLvl != 9) {
		changeBalance(maxEnergyCountPrice[maxEnergyCountLvl], Math.floor(maxEnergyCountPrice[maxEnergyCountLvl] / 120), "decrement");
		maxEnergyCountLvl++;

		maxEnergyCountText.textContent = maxEnergyCountPrice[maxEnergyCountLvl];
		maxEnergyCount = maxEnergyCountValue[maxEnergyCountLvl];
		energyCount = maxEnergyCount;

		energyText.textContent = energyCount + '/' + maxEnergyCount;
		maxEnergyCountInfoText.textContent = maxEnergyCountLvl + " Lvl" + " • " + maxEnergyCount;
		hideAllTabs();
		closePage(shop);
		localStorage.setItem('energyCount', energyCount);
		lastActiveTime = Date.now();
		updateLastActivity();

		localStorage.setItem('maxEnergyCountLvl', maxEnergyCountLvl);
		localStorage.setItem('maxEnergyCount', maxEnergyCount);
	}
	else {
		buyError(maxEnergyCountPrice[maxEnergyCountLvl] - totalScore);
	}
}

function buyChargeSpeed() {
	if (totalScore >= chargeSpeedPrice[chargeSpeedLvl] && chargeSpeedLvl != 9) {
		changeBalance(chargeSpeedPrice[chargeSpeedLvl], Math.floor(chargeSpeedPrice[chargeSpeedLvl] / 120), "decrement");
		chargeSpeedLvl++;

		chargeSpeedText.textContent = chargeSpeedPrice[chargeSpeedLvl];
		timeToReset = chargeSpeedValue[chargeSpeedLvl];

		chargeSpeedInfoText.textContent = chargeSpeedLvl + " Lvl" + " • " + Math.floor(timeToReset / 60);
		hideAllTabs();
		closePage(shop);
		localStorage.setItem('chargeSpeedLvl', chargeSpeedLvl);
		localStorage.setItem('timeToReset', timeToReset);
	}
	else {
		buyError(chargeSpeedPrice[chargeSpeedLvl] - totalScore);
	}
}

function buyMultiEarn() {
	if (totalScore >= multiEarnPrice[multiEarnLvl] && multiEarnLvl != 9) {
		changeBalance(multiEarnPrice[multiEarnLvl], Math.floor(multiEarnPrice[multiEarnLvl] / 120), "decrement");
		multiEarnLvl++;

		multiEarnText.textContent = multiEarnPrice[multiEarnLvl];
		multiEarn = multiEarnValue[multiEarnLvl];

		multiEarnInfoText.textContent = multiEarnLvl + " Lvl" + " • " + multiEarn;
		hideAllTabs();
		closePage(shop);
		localStorage.setItem('multiEarnLvl', multiEarnLvl);
	}
	else {
		buyError(multiEarnPrice[multiEarnLvl] - totalScore);
	}
}

function buyConfirm(buyFunction) {
	console.log("Open");
	Telegram.WebApp.showConfirm("Are you sure you want to buy this?", function (result) {
		if (result) {
			buyFunction();
		}
	});
}

function buyError(needMoney) {
	Telegram.WebApp.showPopup({
		title: "Need more money!",
		message: needMoney + " points aren't enough on your balance",
		buttons: [
			{ id: "yes", type: "default", text: "OK" },
		]
	});
}
