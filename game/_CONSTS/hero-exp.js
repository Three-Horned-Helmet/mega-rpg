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

	const updatedUser = await user.gainExp(exp, levelUp, statGains);

	// Send a congrats level up message
	if(levelUp) {
		try{
			let statMessage = "";
			for(const stat in statGains) {
				statMessage += `${statGains[stat]} ${stat}, `;
			}
			message.channel.send(
				`<@${message.author.id}>: Congratulations your hero just reached level ${updatedUser.hero.level} and gained ${statMessage}your next level is in ${heroExpToNextLevel[level + 1] - currentExp}`,
			);
		}
		catch{
			console.error("Was not able to send new hero level message");
		}
	}

	return { updatedUser, levelUp: levelUp ? true : false };
};


module.exports = { gainHeroExp };