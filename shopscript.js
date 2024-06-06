let maxEnergyCountPrice = [100, 250, 1250, 5500, 10000, 23000, 55500, 144000, 100500];
let chargeSpeedPrice = [100, 250, 1250, 5500, 10000, 23000, 55500, 144000, 100500];
let multiEarnPrice = [100, 250, 1250, 5500, 10000, 23000, 55500, 144000, 100500];

let maxEnergyCountValue = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
let chargeSpeedValue = [10, 9.5, 9, 8.5, 8, 7.5, 7, 6, 5, 4];
let multiEarnValue = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

let maxEnergyCountLvl;
let chargeSpeedLvl;
let multiEarnLvl;

let maxEnergyCountText = document.getElementById("energy-price_text");
let chargeSpeedText = document.getElementById("charge-price_text");
let multiEarnText = document.getElementById("earn-price_text");

let maxEnergyCountBtn = document.getElementById("max-energy_button");
let chargeSpeedBtn = document.getElementById("charge-speed_button");
let multiEarnBtn = document.getElementById("multi-earn_button");



maxEnergyCountBtn.addEventListener('click', buyMaxEnergy);
chargeSpeedBtn.addEventListener('click', buyChargeSpeed);
multiEarnBtn.addEventListener('click', buyMultiEarn);


document.addEventListener('DOMContentLoaded', function () {
	maxEnergyCountLvl = localStorage.getItem('maxEnergyCountLvl', 10) || 0;
	chargeSpeedLvl = localStorage.getItem('chargeSpeedLvl', 10) || 0;
	multiEarnLvl = localStorage.getItem('multiEarnLvl', 10) || 0;

	maxEnergyCountText.textContent = maxEnergyCountPrice[maxEnergyCountLvl];
	chargeSpeedText.textContent = chargeSpeedPrice[chargeSpeedLvl];
	multiEarnText.textContent = multiEarnPrice[multiEarnLvl];

	maxEnergyCount = maxEnergyCountValue[maxEnergyCountLvl];
	chargeSpeed = chargeSpeedValue[chargeSpeedLvl];
	multiEarn = multiEarnValue[multiEarnLvl];
});

function buyMaxEnergy(){
	if(totalScore >= maxEnergyCountPrice[maxEnergyCountLvl]){
		totalScore -= maxEnergyCountPrice[maxEnergyCountLvl];
		maxEnergyCountLvl++;
	
		maxEnergyCountText.textContent = maxEnergyCountPrice[maxEnergyCountLvl];
		maxEnergyCount = maxEnergyCountValue[maxEnergyCountLvl];

		allPointerText.textContent = totalScore;
		localStorage.setItem('totalScore', totalScore.toString());
		localStorage.setItem('maxEnergyCountLvl', maxEnergyCountLvl);
	}
}

function buyChargeSpeed(){
	if(totalScore >= chargeSpeedPrice[chargeSpeedLvl]){
		totalScore -= chargeSpeedPrice[chargeSpeedLvl];
		chargeSpeedLvl++;
	
		chargeSpeedText.textContent = chargeSpeedPrice[chargeSpeedLvl];
		chargeSpeed = chargeSpeedValue[chargeSpeedLvl];

		allPointerText.textContent = totalScore;
		localStorage.setItem('totalScore', totalScore.toString());
		localStorage.setItem('chargeSpeedLvl', chargeSpeedLvl);
	}
}

function buyMultiEarn(){
	if(totalScore >= multiEarnPrice[multiEarnLvl]){
		totalScore -= multiEarnPrice[multiEarnLvl];
		multiEarnLvl++;
	
		multiEarnText.textContent = multiEarnPrice[multiEarnLvl];
		multiEarn = multiEarnValue[multiEarnLvl];

		allPointerText.textContent = totalScore;
		localStorage.setItem('totalScore', totalScore.toString());
		localStorage.setItem('multiEarnLvl', multiEarnLvl);
	}
}

