// An array of level up requirements
const heroExpToNextLevel = [
	100,
	300,
	600,
	1000,
	1500,
	2100,
	2700,
	3400,
	4200,
	5000,
	6000,
];

const heroStatIncreaseOnLevel = [
	{ health: 5, attack: 5 },
	{ health: 50, attack: 40 },
	{ health: 60, attack: 50 },
	{ health: 70, attack: 55 },
	{ health: 85, attack: 65 },
	{ health: 100, attack: 80 },
	{ health: 140, attack: 100 },
	{ health: 190, attack: 140 },
	{ health: 250, attack: 200 },
	{ health: 325, attack: 250 },
	{ health: 400, attack: 300 },
];

// A function that adds the exp to the hero and checks if he gains a new level
// Returns the updated user (updatedUser) and a bolean (levelUp) if the hero gained a level or not
const gainHeroExp = async (user, exp) => {
	if(typeof exp !== "number") {
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
	if(user.hero.currentExp + exp >= user.hero.expToNextRank) {
		levelUp = heroExpToNextLevel[user.hero.level];
		statGains = heroStatIncreaseOnLevel[user.hero.level];
	}

	const response = await user.gainExp(exp, levelUp, statGains);

	return response;
};


module.exports = { gainHeroExp };