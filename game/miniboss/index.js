const { onCooldown } = require("../_CONSTS/cooldowns");
const { worldLocations } = require("../_UNIVERSE");
const { getIcon } = require("../_CONSTS/icons");
const { createMinibossInvitation, createMinibossResult } = require("./embedGenerator");
const { asyncForEach, deepCopyFunction, randomIntBetweenMinMax } = require("../_GLOBAL_HELPERS");
const { createCombatRound } = require("../../combat/advancedCombat");

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
	// user.setNewCooldown("miniboss", now);
	await user.save();

	const minibossInvitation = createMinibossInvitation(miniboss, user);
	const invitation = await message.channel.send(minibossInvitation);
	const minibossIcon = getIcon("miniboss", "icon");
	const progress = setupProgress(miniboss, user);
	await invitation.react(minibossIcon);

	const reactionFilter = (reaction) => reaction.emoji.name === minibossIcon;

	const collector = await invitation.createReactionCollector(reactionFilter, { max: 10, time: 1000 * 20, errors: ["time"] });
	collector.on("collect", async (result, rUser) => {
		if (rUser.bot || progress.teamGreen.length > 9) {
			return;
		}
		const helper = await User.findOne({ "account.userId": "694920" });/* rUser.id */
		const helper2 = await User.findOne({ "account.userId": "353864320221839372" });/* rUser.id */

		if (!helper) {
			return message.channel.send(`<@${message.author.id}>: Something went wrong trying to join this raid`);
		}
		if (!validateHelper(helper)) {
			return message.channel.send(`<@${message.author.id}>: Your HP is too low`);
		}
		/* if (progress.teamGreen.some(player=> player.account.userId === rUser.id)) {
			return message.channel.send(`<@${message.author.id}>: You're already in the raid!`);
		} */
		progress.teamGreen.push(helper);
		progress.teamGreen.push(helper2);
	});

	collector.on("end", async () => {
		const combatResult = await createCombatRound(message, progress);
		console.log(combatResult, "combatREsult");
		// if win
		const rewards = generateRewards(combatResult);
		await giveRewards(rewards, combatResult);
		const embed = createMinibossResult(rewards, combatResult);
		message.channel.send(embed);
	});
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
	initiativeTaker.alternativeGainXp(rewards.initiativeTaker.xp);
	initiativeTaker.gainManyResources({ gold: rewards.initiativeTaker.gold });

	await initiativeTaker.save();
};

const minibossStartAllowed = (user) => {
	const cooldownInfo = onCooldown("miniboss", user);
	if (cooldownInfo.response) {
		return cooldownInfo.embed;
	}

	// checks for too low hp
	if (user.hero.currentHealth < user.hero.health * 0.05 && user.hero.currentHealth < 50) {
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

const validateHelper = async user => {
	return user.hero.currentHealth > user.hero.health * 0.05;
};

const createMinibossEvent = (user) => {
	const { currentLocation } = user.world;
	const minibossname = Object.keys(worldLocations[currentLocation].places).find(p => {
		return worldLocations[currentLocation].places[p].type === "miniboss";
	});
	const miniboss = deepCopyFunction(worldLocations[currentLocation].places[minibossname]);
	return miniboss;
};


const generateRewards = (result) => {
	const initiativeTaker = result.originalGreenTeam[0];
	const helpers = [...result.originalGreenTeam.filter(player => player.account.userId !== initiativeTaker.account.userId)];

	const rewards = {
		initiativeTaker: {
			dungeonKey: initiativeTaker.hero.rank >= result.minRankToGetKey ? result.rewards.dungeonKey : null,
			gold: Math.round(result.rewards.gold / 2),
			xp: Math.round(result.rewards.xp / 2),
		},
		helpers: helpers.map(helper => {
			const randomHelperXp = randomIntBetweenMinMax(result.rewards.xp / (helpers.length + 1), result.rewards.xp);
			const randomHelperGold = randomIntBetweenMinMax(result.rewards.gold / (helpers.length + 1), result.rewards.gold);
			const helperName = helper.account.username;
			const helperLeveledUp = randomHelperXp + helper.hero.currentExp > helper.hero.expToNextRank;
			return {
				randomHelperXp,
				randomHelperGold,
				helperName,
				helperLeveledUp,
			};
		})
	};
	return rewards;
};

const setupProgress = (miniboss, user) => {
	// todo add progress
	const progress = {
		combatRules:{
			armyAllowed: miniboss.combatRules.armyAllowed,
			maxRounds: miniboss.combatRules.maxRounds,
			helpersAllowed: miniboss.combatRules.helpersAllowed,
		},
		teamGreen:[user],
		teamRed:[miniboss],
		minRankToGetKey: 2,
		rewards: { dungeonKey: "CM Key", gold: 120, xp: 500 },
		embedInformation: {
			minimal: false,
			teamRedName: miniboss.name,
			teamGreenName: user.account.username,
			title: `${miniboss.name} vs ${user.account.username}`
		}
	};
	return progress;
};

module.exports = { handleMiniboss, createMinibossEvent, minibossStartAllowed, createMinibossResult };