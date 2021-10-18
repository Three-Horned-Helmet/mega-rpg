// An array of level up requirements
const heroExpToNextLevel = [
	100,
	300,
	600,
	1000,
	2000,
	3100,
	4700,
	5900,
	7200,
	8800,
	10200,
	11800,
	14000,
	17500,
	25000,
	39000,
	71000,
	124000,
	184000,
	244000,
	300000,
	350000,
	425000,
	500000,
	590000,
	650000,
	800000,
	980000,
	1200000,
	1500000,
	1800000,
	2200000,
	2500000,
	2900000,
	3400000,
	3900000,
	4500000,
	6000000
];

const heroStatIncreaseOnLevel = [
	{ health: 5, attack: 5 },
	{ health: 30, attack: 30 },
	{ health: 35, attack: 40 },
	{ health: 40, attack: 30 },
	{ health: 85, attack: 65 },
	{ health: 100, attack: 80 },
	{ health: 120, attack: 90 },
	{ health: 130, attack: 110 },
	{ health: 150, attack: 130 },
	{ health: 170, attack: 140 },
	{ health: 190, attack: 155 },
	{ health: 200, attack: 160 },
	{ health: 215, attack: 165 },
	{ health: 230, attack: 170 },
	{ health: 240, attack: 185 },
	{ health: 245, attack: 200 },
	{ health: 270, attack: 220 },
	{ health: 290, attack: 240 },
	{ health: 295, attack: 245 },
	{ health: 300, attack: 245 },
	{ health: 300, attack: 250 },
	{ health: 305, attack: 250 },
	{ health: 305, attack: 255 },
	{ health: 310, attack: 260 },
	{ health: 320, attack: 275 },
	{ health: 335, attack: 290 },
	{ health: 350, attack: 310 },
	{ health: 375, attack: 320 },
	{ health: 390, attack: 335 },
	{ health: 405, attack: 350 },
	{ health: 520, attack: 370 },
	{ health: 530, attack: 385 },
	{ health: 550, attack: 400 },
	{ health: 580, attack: 435 },
	{ health: 610, attack: 470 },
	{ health: 650, attack: 510 },
];

// A function that adds the exp to the hero and checks if he gains a new level
// Returns the updated user (updatedUser) and a bolean (levelUp) if the hero gained a level or not
const gainHeroExp = async (user, exp, message) => {
	if(typeof exp !== "number" || isNaN(exp)) {
		console.error("Exp needs to be a number");
		return;
	}
	else if(exp <= 0) {
		console.error("Exp needs to be higher than zero");
		return;
	}

	// Check if level up
	let levelUp = false;
	let statGains = false;
	const { currentExp, expToNextRank, level } = user.hero;
	if(
		currentExp + exp >= expToNextRank &&
        heroExpToNextLevel.length >= level &&
        heroStatIncreaseOnLevel.length >= level
	) {
		levelUp = heroExpToNextLevel[level + 1];
		statGains = heroStatIncreaseOnLevel[level + 1];
	}

	user.gainExp(exp, levelUp, statGains);
	const updatedUser = await user.save();

	// Send a congrats level up message
	if(levelUp) {
		try{
			let statMessage = "";
			for(const stat in statGains) {
				statMessage += `${statGains[stat]} ${stat}, `;
			}
			message.channel.send(
				`<@${user.account.userId}>: Congratulations your hero just reached level ${updatedUser.hero.rank} and gained ${statMessage}your next level is in ${heroExpToNextLevel[level + 1] - currentExp} exp`,
			);
		}
		catch(err) {
			console.error("Was not able to send new hero level message", err);
		}
	}

	return { updatedUser, levelUp: levelUp ? true : false };
};

// A function that removes the exp to the hero and checks if he lost a new level
// Returns the updated user (updatedUser) and a bolean (levelRemoved) if the hero lost a level or not
const removeHeroExp = async (user, exp, message) => {
	if(typeof exp !== "number" || isNaN(exp)) {
		console.error("Exp needs to be a number");
		return;
	}
	else if(exp <= 0) {
		console.error("Exp needs to be higher than zero");
		return;
	}

	// Check if level down
	let levelDown = false;
	let statRemoved = false;
	const { currentExp, level } = user.hero;
	if(
		currentExp - exp < heroExpToNextLevel[level - 1] ? heroExpToNextLevel[level - 1] : 0
	) {
		levelDown = heroExpToNextLevel[level];
		statRemoved = heroStatIncreaseOnLevel[level];
	}

	user.removeExp(exp, levelDown, statRemoved);
	const updatedUser = await user.save();

	// Send a level down message
	if(levelDown) {
		try{
			let statMessage = "";
			for(const stat in statRemoved) {
				statMessage += `${statRemoved[stat]} ${stat}, `;
			}
			message.channel.send(
				`<@${user.account.userId}>: Your hero lost a level in the battle and is now level ${updatedUser.hero.rank} and lost stats: ${statMessage}`,
			);
		}
		catch(err) {
			console.error("Was not able to send new hero level message", err);
		}
	}

	return { updatedUser, levelDown: levelDown ? true : false };
};


module.exports = { gainHeroExp, heroStatIncreaseOnLevel, removeHeroExp, heroExpToNextLevel };