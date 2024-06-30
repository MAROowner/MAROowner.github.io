let lastRewardedDay = 0;
let totalActiveDays = 0;
let rewards = [ 100, 200, 300, 400, 500, 1000, 1500, 3000, 5000, 20000]

let rewardBlock = document.querySelector(".reward-block");
let dayBlocks = document.querySelectorAll('.day-reward');


document.querySelector(".reward-btn").addEventListener("click", closeReward);

/*async function getCurrentTime() {
	try {
		 const response = await fetch('http://worldtimeapi.org/api/ip');
		 const data = await response.json();
		 const dateTime = new Date(data.datetime);
		 return dateTime;
	} catch (error) {
		 console.error('Помилка отримання поточного часу:', error);
		 return null;
	}
}

getCurrentTime().then(dateTime => {
	if (dateTime) {
		deltaTime = Date();
		let dayOfWeek = dateTime.getDay();
		lastRewardedDay = localStorage.getItem("lastRewardedDay", lastRewardedDay) || dayOfWeek;
		totalActiveDays = localStorage.getItem("totalActiveDays", totalActiveDays) || 0;

		openReward();

		if(dayOfWeek - lastRewardedDay == 1 || dayOfWeek - lastRewardedDay == -6 || dayOfWeek - lastRewardedDay == 0 && totalActiveDays == 0){
			console.log('Вам зачислено: ' + rewards[totalActiveDays]);
			openReward();
			lastRewardedDay = dayOfWeek
		} else if (dayOfWeek - lastRewardedDay !== 0) {
			totalActiveDays = 0;
			lastRewardedDay = dayOfWeek;
			console.log('Вам зачислено: ' + rewards[totalActiveDays]);
			openReward();
	   }

		console.log(totalActiveDays);
	}
});*/

document.addEventListener('DOMContentLoaded', function () {
	let isAgree = JSON.parse(localStorage.getItem("isAgree")) || false;
	if(isAgree){
		start();
	}
});

function start(){
	deltaTime = new Date();
	let dayOfWeek = deltaTime.getDay();
	
	lastRewardedDay = localStorage.getItem("lastRewardedDay", lastRewardedDay) || dayOfWeek;
	totalActiveDays = localStorage.getItem("totalActiveDays", totalActiveDays) || 0;

	if(dayOfWeek - lastRewardedDay == 1 || dayOfWeek - lastRewardedDay == -6 || dayOfWeek - lastRewardedDay == 0 && totalActiveDays == 0){
		console.log('Вам зачислено: ' + rewards[totalActiveDays]);
		openReward();
		lastRewardedDay = dayOfWeek
	} else if (dayOfWeek - lastRewardedDay !== 0) {
		totalActiveDays = 0;
		lastRewardedDay = dayOfWeek;
		console.log('Вам зачислено: ' + rewards[totalActiveDays]);
		openReward();
	}

	console.log(totalActiveDays);
}

function openReward(){
	for (let i = 0; i <= totalActiveDays; i++) {
		if (i < totalActiveDays) {
			dayBlocks[i].classList.add('taked');
		} else {
			dayBlocks[i].classList.add('today');
		}
   }

	isPause = true;
	rewardBlock.style.display = 'block';
	rewardBlock.classList.add('show');
	document.querySelector('.main-button').style.display = 'none';
	pointerText.style.display = 'none';
}

function closeReward(){
	dayBlocks[totalActiveDays].classList.remove('today');
	dayBlocks[totalActiveDays].classList.add('taked');
	changeBalance(rewards[totalActiveDays], Math.floor(rewards[totalActiveDays] / 120), 'increment');
	totalActiveDays++;

	if(totalActiveDays >= 10){
		totalActiveDays = 0;
	}

	rewardBlock.classList.remove('show');
	setTimeout(() => {
      rewardBlock.style.display = 'none';
		document.querySelector('.main-button').style.display = 'flex';
		pointerText.style.display = 'block';
		isPause = false;
   }, 200);
	
	localStorage.setItem("lastRewardedDay", lastRewardedDay);
	localStorage.setItem("totalActiveDays", totalActiveDays);
	localStorage.setItem("totalScore", totalScore);
}
