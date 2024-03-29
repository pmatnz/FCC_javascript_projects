let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["Stick"];

//using document.querySelector give access to maniupulate HTML elements
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");

const monsterHealthtext = document.querySelector("#monsterHealth");
//monsterHealth element

const weapons = [
	{ name: "stick", power: 5 },
	{ name: "dagger", power: 30 },
	{ name: "claw hammer", power: 50 },
	{ name: "sword", power: 100 },
];

const monsters = [
	{
		name: "slime",
		level: 2,
		health: 15,
	},
	{
		name: "fanged beast",
		level: 8,
		health: 60,
	},
	{
		name: "dragon",
		level: 20,
		health: 300,
	},
];

const locations = [
	{
		name: "town square",
		"button text": ["Go to store", "Go to cave", "Fight dragon"],
		"button functions": [goStore, goCave, fightDragon],
		text: 'You are in the town square. You see a sign that says "Store" .',
	},
	{
		name: "store",
		"button text": [
			"Buy 10 health (10 gold)",
			"Buy weapon (30 gold)",
			"Go to town square",
		],
		"button functions": [buyHealth, buyWeapon, goTown],
		text: "You enter the Store.",
	},

	{
		name: "cave",
		"button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
		"button functions": [fightSlime, fightBeast, goTown],
		text: "You enter the cave. You see some monsters.",
	},
	{
		name: "fight",
		"button text": ["Attack", "Dodge", "Run"],
		"button functions": [attack, dodge, goTown],
		text: "You are fighting a monster.",
	},
	{
		name: "Kill monster",
		"button text": [
			"Go to town square",
			"Go to town square",
			"Go to town square",
		],
		"button functions": [goTown, goTown, easterEgg],
		text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.',
	},
	{
		name: "lose",
		"button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
		"button functions": [restart, restart, restart],
		text: "You die. ☠️",
	},
	{
		name: "win",
		"button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
		"button functions": [restart, restart, restart],
		text: "You defeat the dragon! YOU WIN THE GAME! 🎉.",
	},
	{
		name: "easter egg",
		"button text": ["2", "8", "Go to town square?"],
		"button functions": [pickTwo, pickEight, goTown],
		text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!",
	},
];

//initialize buttons, first buttons user sees that links to all other actions
button1.onclick = goStore; //using the goStore variable on mouse click
button2.onclick = goCave; //using the goCave variable on mouse click
button3.onclick = fightDragon; //using the fightDragon variable on mouse click

function goTown() {
	update(locations[0]);
}

function goStore() {
	update(locations[1]);
}

function goCave() {
	update(locations[2]);
}

function update(location) {
	monsterStats.style.display = "none"; // change CSS display to none to hides the stats box
	button1.innerText = location["button text"][0];
	button2.innerText = location["button text"][1];
	button3.innerText = location["button text"][2];
	button1.onclick = location["button functions"][0];
	button2.onclick = location["button functions"][1];
	button3.onclick = location["button functions"][2];
	text.innerText = location.text;
}

function buyHealth() {
	if (gold >= 10) {
		gold -= 10;
		health += 10;
		goldText.innerText = gold;
		healthText.innerText = health;
	} else {
		text.innerText = "You do not have enough gold to buy health";
	}
}

function buyWeapon() {
	if (currentWeapon < weapons.length - 1) {
		if (gold >= 30) {
			gold = gold -= 30;
			currentWeapon++;
			goldText.innerText = gold;
			let newWeapon = weapons[currentWeapon].name;
			text.innerText = `You now have a ${newWeapon} .`; //"You now have a " + newWeapon + ".";
			inventory.push(newWeapon);
			text.innerText += ` In your inventory you have: ${inventory} `; //" In your inventory you have: " + inventory;
		} else {
			text.innerText = "You do not have enough gold to buy a weapon.";
		}
	} else {
		text.innerText = "You already have the most powerful weapon!";
		button2.innerText = "Sell Weapon for 15 gold";
		button2.onclick = sellWeapon;
	}
}

function sellWeapon() {
	if (inventory.length > 1) {
		gold += 15;
		goldText.innerText = gold;
		let currentWeapon = inventory.shift(); // I already have a currentWeapon variable however this is in the scope of the if statement, the other variable is a global variable. Using var would cause both to be global
		text.innerText = `You sold a ${currentWeapon} .`; // "You sold a " + currentWeapon + ".";
		text.innerText = ` In your inventory you have ${inventory}`; //" In your invetory you have" + inventory;
	} else {
		inventory.length = text.innerText = "Don't sell your only weapon!";
	}
}

function goFight() {
	update(locations[3]);
	monsterHealth = monsters[fighting].health;
	/* monsterHealth takes in all the data from the monters variable, it then will look at fighting which dictates what number index of the array we are looking at, then it will look at the 
	health of the monster via the object and return the health that is next to the health object*/
	monsterStats.style.display = "block";
	monsterName.innerText = monsters[fighting].name;
	monsterHealthtext.innerText = monsters[fighting].health;
}

function fightDragon() {
	fighting = 2;
	goFight();
}

function fightSlime() {
	fighting = 0;
	goFight();
}

function fightBeast() {
	fighting = 1;
	goFight();
}

// prettier-ignore
function attack() {
	text.innerText = `The ${monsters[fighting].name} attacks, `;
	text.innerText += ` You attack it with your ${weapons[currentWeapon].name}! `;
	health -= getMonsterAttackValue(monsters[fighting].level);
	
	if (isMonsterHit()) {
			monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
		} else {
			text.innerText += " You miss."
		}
	
	healthText.innerText = health;
	monsterHealthtext.innerText = monsterHealth;
	
	if (health <= 0) {
		lose()
		} else if (monsterHealth <= 0) {
			fighting === 2 ? winGame() : defeatMonster(); /*
			Original if statement below before using tenary
			if (fighting === 2) {
				winGame()
			} else {
				defeatMonster();
				} */
		} 
	
	if (Math.random() <= .1 && inventory.length !== 1) {
		text.innerText += ` Your  ${inventory.pop()}  breaks.`; // Your + inventory.pop() + breaks.
		currentWeapon --; // this is going to remove 1 off the current weapon
		};
}

function getMonsterAttackValue(level) {
	const hit = level * 5 - Math.floor(Math.random() * xp);
	console.log(hit);
	return hit > 0 ? hit : 0;
}

function isMonsterHit() {
	return Math.random() > 0.2 || health < 20;
}

function dodge() {
	text.innerText = ` You dodge the attack from the ${monsters[fighting].name} `;
}

function lose() {
	update(locations[5]);
}

function winGame() {
	update(locations[6]);
}

function defeatMonster() {
	gold += Math.floor(monsters[fighting].level * 6.7);
	xp += monsters[fighting].level;
	goldText.innerText = gold;
	xpText.innerText = xp;
	update(locations[4]);
}

function restart() {
	xp = 0;
	health = 100;
	gold = 50;
	currentWeapon = 0;
	inventory = ["stick"];
	goldText.innerText = gold;
	healthText.innerText = health;
	xpText.innerText = xp;
	goTown();
}

function easterEgg() {
	update(locations[7]);
}

function pick(guess) {
	let numbers = [];
	while (numbers.length < 10) {
		numbers.push(Math.floor(Math.random() * 11));
	}
	text.innerText = `You picked ${guess} . Here are the random numbers:\n`;

	for (let i = 0; i < 10; i++) {
		// created a variable x, when x is less than 5 , add 1 to x - a counter
		text.innerText += numbers[i] + "\n";
	}

	if (numbers.includes(guess)) {
		text.innerText += "Right! You win 20 gold!";
		gold += 20;
		goldText.innerText = gold;
	} else {
		text.innerText += "Wrong! You lose 10 health!";
		health -= 10;
		healthText.innerText = health;
	}

	if (health <= 0) {
		lose();
	}
}

function pickTwo() {
	pick(2);
}

function pickEight() {
	pick(8);
}
