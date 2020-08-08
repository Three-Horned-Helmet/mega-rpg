const { onCooldown } = require("../_CONSTS/cooldowns");
const { worldLocations } = require("../_UNIVERSE");
const { getIcon } = require("../_CONSTS/icons");
const { createMinibossInvitation, createMinibossResult } = require("./embedGenerator");
const { asyncForEach, deepCopyFunction, randomIntBetweenMinMax } = require("../_GLOBAL_HELPERS");

const User = require("../../models/User");

// Note: The success of defeating the miniboss is based soley on user rank
const handleMiniboss = async (message, user) => {

	// cooldown, health, explored miniboss
	const disallowed = minibossStartAllowed(user);
	if (disallowed) {
		return message.channel.send(disallowed);
	}

	const miniboss = createMinibossEvent(user);
	const now = new Date();
	user.setNewCooldown("miniboss", now);
	await user.save();

	const minibossInvitation = createMinibossInvitation(miniboss, user);
	const invitation = await message.channel.send(minibossInvitation);
	const minibossIcon = getIcon("miniboss", "icon");
	await invitation.react(minibossIcon);

	const reactionFilter = (reaction) => {
		return reaction.emoji.name === minibossIcon;
	};

	const collector = await invitation.createReactionCollector(reactionFilter, { max: 10, time: 1000 * 20, errors: ["time"] });
	collector.on("collect", async (result, rUser) => {
		if (rUser.bot || miniboss.helperIds.length > 9) {
			return;
		}
		const allowedHelper = await validateHelper(rUser.id);
		if (!allowedHelper) {
			return message.channel.send(`<@${message.author.id}>: Your HP is too low`);
		}
		miniboss.helperIds.push(rUser.id);
	});

	collector.on("end", async () => {
		const result = await calculateMinibossResult(miniboss);
		const embed = createMinibossResult(result, miniboss);
		message.channel.send(embed);
	});
};

const minibossStartAllowed = (user) => {

	const cooldownInfo = onCooldown("miniboss", user);
	if (cooldownInfo.response) {
		return cooldownInfo.embed;
	}

	// checks for too low hp
	if (user.hero.currentHealth < user.hero.health * 0.05) {
		let feedback = `Your hero's health is too low (**${user.hero.currentHealth}**)`;
		if (user.hero.rank < 2) {
			feedback += "\n You can `!build` a shop and `!buy` potions";
		}
		return feedback;
	}

	const { currentLocation } = user.world;
	const minibossInformation = Object.values(worldLocations[currentLocation].places).find(p => p.type === "miniboss");


	const locationIcon = getIcon(currentLocation);
	if (!user.world.locations[currentLocation].explored.includes([minibossInformation.name])) {
		return `You haven't found any miniboss in ${locationIcon} ${currentLocation}`;
	}
	return null;
};

const createMinibossEvent = (user) => {
	const { currentLocation } = user.world;
	const minibossname = Object.keys(worldLocations[currentLocation].places).find(p => {
		return worldLocations[currentLocation].places[p].type === "miniboss";
	});
	const miniboss = deepCopyFunction(worldLocations[currentLocation].places[minibossname]);
	miniboss.helperIds.push(user.account.userId);
	return miniboss;
};

const validateHelper = async discordId => {
	const user = await User.findOne({ "account.userId": discordId }).lean();
	return user.hero.currentHealth > user.hero.health * 0.05;
};


const calculateMinibossResult = async (miniboss) => {
	const users = await User.find({ "account.userId": miniboss.helperIds });

	const initiativeTaker = users.filter(user => user.account.userId === miniboss.helperIds[0]);
	const helpers = users.filter(user => user.account.userId !== miniboss.helperIds[0]);

	let chanceForSuccess = helpers.reduce((acc, cur) => {
		return acc + cur.hero.rank;
	}, 0) + initiativeTaker[0].hero.rank + 2;

	// ensures that it's not possible to have a 100% or more chance of success
	if (chanceForSuccess > miniboss.stats.difficulty) {
		chanceForSuccess = miniboss.stats.difficulty - 5;
	}

	// Temporary workaround for testcases
	/* if (initiativeTaker[0].account.testUser) {
		chanceForSuccess -= 10;
	} */

	const difficulty = Math.random() * miniboss.stats.difficulty;

	const result = {
		win: false,
		initiativeTaker: initiativeTaker[0],
		helpers: helpers,
		rewards: {
			initiativeTaker: {
				dungeonKey: null,
				gold: Math.round(miniboss.rewards.gold / 2),
				xp: Math.round(miniboss.rewards.xp / 2),
			},
			helpers: [],
		},
		damageDealt: {
			initiativeTaker: randomIntBetweenMinMax(miniboss.stats.attack / 2, miniboss.stats.attack),
			initiativeTakerDead: false,
			helpers: [],
		},
	};
	// checks if initativetaker is dead
	if (result.damageDealt.initiativeTaker >= result.initiativeTaker.hero.currentHealth) {
		result.damageDealt.initiativeTakerDead = true;
	}

	// checks for success
	if (chanceForSuccess > difficulty) {
		result.win = true;

		if (result.initiativeTaker.hero.rank >= miniboss.rules.minRankToGetKey) {
			result.rewards.initiativeTaker.dungeonKey = miniboss.rewards.dungeonKey;
		}

		result.initiativeTaker.giveDungeonKey(result.rewards.initiativeTaker.dungeonKey);
		result.initiativeTaker.alternativeGainXp(result.rewards.initiativeTaker.xp);
		result.initiativeTaker.gainManyResources({ gold: result.rewards.initiativeTaker.gold });

		result.helpers.forEach(helper => {
			const randomHelperXp = randomIntBetweenMinMax(miniboss.rewards.xp / (helpers.length + 1), miniboss.rewards.xp);
			const randomHelperGold = randomIntBetweenMinMax(miniboss.rewards.gold / (helpers.length + 1), miniboss.rewards.gold);
			const helperName = helper.account.username;
			const helperLeveledUp = randomHelperXp + helper.hero.currentExp > helper.hero.expToNextRank;
			helper.alternativeGainXp(randomHelperXp);
			helper.gainManyResources({ gold: randomHelperGold });
			result.rewards.helpers.push({
				randomHelperXp,
				randomHelperGold,
				helperName,
				helperLeveledUp,
			});
		});
	}
	else {
		result.initiativeTaker.heroHpLossFixedAmount(result.damageDealt.initiativeTaker);
		result.helpers.forEach(helper => {
			const randomHelperDamage = randomIntBetweenMinMax(miniboss.stats.attack / 2, miniboss.stats.attack);
			const helperDead = helper.hero.currentHealth - randomHelperDamage <= 0;
			helper.heroHpLossFixedAmount(randomHelperDamage);
			result.rewards.helpers.push({
				randomHelperDamage,
				helperDead,
			});
		});
	}
	// saves to db
	await asyncForEach(result.helpers, async (helper) => {
		await helper.save();
	});
	result.initiativeTaker.save()
		.then(()=> result)
		.catch((e)=>{
			console.error("Error: ", e);
		});

	return result;
};


module.exports = { handleMiniboss, createMinibossEvent, minibossStartAllowed, createMinibossResult, calculateMinibossResult };