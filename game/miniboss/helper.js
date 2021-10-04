const { asyncForEach, deepCopyFunction, randomIntBetweenMinMax } = require("../_GLOBAL_HELPERS");
const { getIcon } = require("../_CONSTS/icons");
const { onCooldown } = require("../_CONSTS/cooldowns");
const { worldLocations } = require("../_UNIVERSE");

const minibossStartAllowed = (user) => {
	const cooldownInfo = onCooldown("miniboss", user);
	if (cooldownInfo.response) {
		return cooldownInfo.embed;
	}

	if (user.hero.currentHealth < user.hero.health * 0.05 || user.hero.currentHealth < 50) {
		let feedback = `Your hero's health is too low (**${user.hero.currentHealth}**)`;
		if (user.hero.rank < 2) feedback += "\n You can `!build` a shop and `!buy` potions";
		return feedback;
	}

	const { currentLocation } = user.world;
	const minibossInformation = Object.values(worldLocations[currentLocation].places).find(p => p.type === "miniboss");

	if (!user.world.locations[currentLocation].explored.includes([minibossInformation.name])) {
		return `You haven't found any miniboss in ${getIcon(currentLocation)} ${currentLocation}`;
	}
	return null;
};

const generateRewards = (result) => {
	const initiativeTaker = result.originalGreenTeam[0];
	const helpers = [...result.originalGreenTeam.filter(player => player.account.userId !== initiativeTaker.account.userId)];
	const userHasMinibossKey = initiativeTaker.hero.dungeonKeys && initiativeTaker.hero.dungeonKeys[result.rewards.dungeonKey] > 0;

	const dungeonKey = initiativeTaker.hero.rank >= result.minRankToGetKey && !userHasMinibossKey ? result.rewards.dungeonKey : null;
	const gold = Math.round(result.rewards.gold / 2);
	const xp = Math.round(result.rewards.xp / 2);

	const rewards = {
		initiativeTaker: {
			dungeonKey,
			gold,
			xp,
			leveledUp: xp + initiativeTaker.hero.currentExp > initiativeTaker.hero.expToNextRank
		},
		helpers: helpers.map(helper => {
			const randomHelperXp = randomIntBetweenMinMax(result.rewards.xp / (helpers.length + 2), result.rewards.xp);
			const randomHelperGold = randomIntBetweenMinMax(result.rewards.gold / (helpers.length + 2), result.rewards.gold);
			const helperName = helper.account.username;
			const leveledUp = randomHelperXp + helper.hero.currentExp > helper.hero.expToNextRank;
			return {
				randomHelperXp,
				randomHelperGold,
				helperName,
				leveledUp,
			};
		})
	};
	return rewards;
};

const giveRewards = async (rewards, combatResult) => {
	const initiativeTaker = combatResult.teamGreen[0];
	const helpers = [...combatResult.teamGreen.filter(player => player.account.userId !== initiativeTaker.account.userId)];

	helpers.forEach((helper, i)=> {
		const xp = rewards.helpers[i].randomHelperXp;
		const gold = rewards.helpers[i].randomHelperGold;
		helper.alternativeGainXp(xp);
		helper.gainManyResources({ gold });
	});
	await asyncForEach(helpers, async (helper) => {
		await helper.save();
	});

	if (rewards.initiativeTaker.dungeonKey) {
		initiativeTaker.giveDungeonKey(rewards.initiativeTaker.dungeonKey);
	}
	initiativeTaker.alternativeGainXp(rewards.initiativeTaker.xp);
	initiativeTaker.gainManyResources({ gold: rewards.initiativeTaker.gold });

	await initiativeTaker.save();
};


const validateHelper = (progress, helper, helperId)=> {
	let response = "";
	if (!helper) {
		response = "Something went wrong trying to join this raid!";
	}
	else if (helper.hero.currentHealth > helper.hero.health * 0.05 && helper.hero.currentHealth < 50) {
		response = "Your HP is too low!";
	}
	else if (progress.teamGreen.some(player=> player.account.userId === helperId)) {
		response = "You're already in the raid!";
	}
	return response;
};

const createMinibossEvent = (user) => {
	const { currentLocation } = user.world;
	const minibossname = Object.keys(worldLocations[currentLocation].places).find(p => {
		return worldLocations[currentLocation].places[p].type === "miniboss";
	});
	const miniboss = deepCopyFunction(worldLocations[currentLocation].places[minibossname]);
	return miniboss;
};

const setupProgress = (miniboss, user) => {
	return {
		combatRules:{
			armyAllowed: miniboss.combatRules.armyAllowed,
			maxRounds: miniboss.combatRules.maxRounds,
			helpersAllowed: miniboss.combatRules.helpersAllowed,
		},
		teamGreen:[user],
		teamRed:[miniboss],
		minRankToGetKey: 2,
		rewards: miniboss.rewards,
		embedInformation: {
			minimal: false,
			teamRedName: miniboss.name,
			teamGreenName: user.account.username,
			title: `${miniboss.name} vs ${user.account.username}`
		}
	};
};

module.exports = { giveRewards, minibossStartAllowed, validateHelper, createMinibossEvent, generateRewards, setupProgress };