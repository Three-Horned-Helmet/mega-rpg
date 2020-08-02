const { generateEmbedCombatRound, generateEmbedCombatResult } = require("./embedGenerator");
const { getWeaponInfo } = require("./helper");
const { asyncForEach, randomIntBetweenMinMax } = require("../../game/_GLOBAL_HELPERS");


const createCombatRound = async (message, progress) => {
	// validate progress object
	validateProgress(progress);

	// eslint-disable-next-line prefer-const
	let { numOfAllowedWeapons, allowedWeapons, weaponAnswers } = progress.weaponInformation;

	if (progress.allDiscordIds.size === 0) {
		populateDiscordIds(progress);
		populatePlayerNames(progress);
	}
	allowedWeapons = getWeaponInfo(null, numOfAllowedWeapons);
	progress.weaponInformation.allowedWeapons = allowedWeapons;

	const weaponAnswerFilter = Object.keys(allowedWeapons)
		.map((w) => [allowedWeapons[w].answer, allowedWeapons[w].name])
		.flat();

	const combatRound = generateEmbedCombatRound(progress);
	await message.channel.send(combatRound);

	const filter = (response) => {
		// checks if included in the fight
		return progress.allDiscordIds.has(response.author.id);
	};

	const collector = await message.channel.createMessageCollector(filter, {
		time: 1000 * 20,
		errors: ["time"],
	});
	collector.on("collect", async (result) => {
		if (result.author.bot) {
			return;
		}
		if (weaponAnswers.has(result.author.id)) {
			return message.channel.send("You've already chosen a weapon");
		}
		if (!weaponAnswerFilter.includes(result.content.toLowerCase())) {
			return message.channel.send("Invalid weapon");
		}
		const answer = result.content.toLowerCase();

		// adds answer to progress object
		if (Object.keys(allowedWeapons).includes(answer)) {
			weaponAnswers.set(result.author.id, answer);
		}
		else {
			const weaponInformation = Object.values(allowedWeapons).find(
				(w) => w.answer === answer
			);
			weaponAnswers.set(result.author.id, weaponInformation.name);
		}
		// stops collecting if all users have answered
		if (weaponAnswers.size >= progress.allDiscordIds.length) {
			collector.stop();
		}
	});
	collector.on("end", async () => {
		const result = await calculateCombatResult(progress);
		if (result.winner) {
			const finalResult = await generateEmbedCombatResult(progress);
			return message.channel.send(finalResult);
		}
		else {
			return await createCombatRound(message, result);
		}
	});
};

const calculateCombatResult = async (progress) => {
	// eslint-disable-next-line prefer-const
	let { roundResults, teamGreen, teamRed } = progress;
	const { weaponAnswers } = progress.weaponInformation;

	// cleans up roundResults from previous round
	roundResults = [];

	const awaitHealPromises = {};
	const awaitDamagePromises = {};

	weaponAnswers.forEach((weapon, player) => {
		const isTeamGreen = teamGreen.some(member=> member.account.userId === player);

		let playerInfo, randomVictim, teamMateWithLowestHp;

		if (isTeamGreen) {
			playerInfo = teamGreen.find((member) => member.account.userId === player);
			randomVictim = teamRed[Math.floor(Math.random() * teamRed.length)];
			teamMateWithLowestHp = teamGreen
				.sort((a, b)=> a.hero.currentHealth - b.hero.currentHealth)
				.filter((p)=> p.hero.currentHealth > 0)[0];
		}
		else {
			playerInfo = teamRed.find((member) => member.account.userId === player);
			randomVictim = teamGreen[Math.floor(Math.random() * teamGreen.length)];
			teamMateWithLowestHp = teamRed
				.sort((a, b)=> a.hero.currentHealth - b.hero.currentHealth)
				.filter((p)=> p.hero.currentHealth > 0)[0];
		}
		// lower chance is better
		const chance = Math.random();

		const weaponInfo = getWeaponInfo(weapon);
		const playerName = playerInfo.account.username;
		const victimName = randomVictim.account.username;


		if (weaponInfo.chanceforSuccess > chance) {
			if (weaponInfo.type === "attack") {
				const damageGiven = randomIntBetweenMinMax(
					(playerInfo.hero.attack / 2) * weaponInfo.damage,
					playerInfo.hero.attack * weaponInfo.damage
				);
				// playerResult.damageGiven = tempDamageGiven;

				if (awaitDamagePromises[victimName]) {
					awaitDamagePromises[victimName].damage += damageGiven;
				}
				else {
					awaitDamagePromises[victimName] = {
						user: randomVictim,
						damage: damageGiven,
					};
				}
				roundResults.push(
					generateAttackString(
						playerName,
						weaponInfo,
						damageGiven,
						victimName
					)
				);
			}
			if (weaponInfo.type === "heal") {
				const playerHealedName = teamMateWithLowestHp.account.username;
				const healGiven = randomIntBetweenMinMax(
					(playerInfo.hero.health * weaponInfo.damage) / 2,
					playerInfo.hero.health * weaponInfo.damage
				);
				if (awaitHealPromises[victimName]) {
					awaitHealPromises[victimName].healGiven += healGiven;
				}
				else {
					awaitHealPromises[victimName] = {
						user: teamMateWithLowestHp,
						healGiven: healGiven,
					};
				}
				roundResults.push(
					generateHealString(
						playerName,
						weaponInfo,
						healGiven,
						playerHealedName
					)
				);
			}
		}
	});

	// todo probably too many awaits
	// takes care of healing
	Object.keys(awaitHealPromises).forEach(async (u) => awaitHealPromises[u].user.healHero(awaitHealPromises[u].healGiven));

	// inflicts damage on user document
	Object.keys(awaitDamagePromises).forEach(async (u) => awaitDamagePromises[u].user.heroHpLossFixedAmount(awaitDamagePromises[u].damage));

	await asyncForEach(teamRed, async (member)=>{
		await member.save();
	});
	await asyncForEach(teamGreen, async (member)=>{
		await member.save();
	});
	// await player.save(); ???????

	// removes player from combat
	progress.teamGreen.filter(member=>member.hero.currentHealth > 0);
	progress.teamRed.filter(member=>member.hero.currentHealth > 0);

	progress.currentRound += 1;
	progress.weaponInformation.weaponAnswers.clear();

	// checks if fight is over
	progress.winner = checkWinner(progress);

	return progress;
};

const generateAttackString = (playerName, weaponInfo, damageGiven, playerAttacked) => {
	return `\n- **${playerName}** used ${weaponInfo.name} attack causing **${damageGiven}** damage to **${playerAttacked}**`;

};
const generateHealString = (playerName, weaponInfo, healGiven, playerHealed) => {
	return `\n${playerName} helead ${playerHealed === playerName ? "himself" : playerHealed}. +${healGiven} HP`;
};


const populateDiscordIds = (progress)=>{
	progress.teamGreen.forEach(member=> progress.allDiscordIds.add(member.account.userId));
	progress.teamRed.forEach(member=> progress.allDiscordIds.add(member.account.userId));
};

const populatePlayerNames = (progress)=>{
	progress.teamGreen.forEach(member=> progress.allPlayerNames.add(member.account.userId));
	progress.teamRed.forEach(member=> progress.allPlayerNames.add(member.account.userId));
};

const checkWinner = progress=>{
	const{ teamGreen, teamRed } = progress;
	if (teamGreen.length === 0 && teamRed.length === 0) {
		return "draw";
	}
	if (teamGreen.length === 0 || teamRed.length === 0) {
		return teamGreen.length === 0 ? "teamRed" : "teamGreen";
	}
	if (progress.currentRound > progress.combatRules.maxRounds) {
		return "No winners";
	}
	return null;
};

const validateProgress = (progress)=>{

	const progressKeys = ["winner", "roundResults", "currentRound", "combatRules", "weaponInformation", "teamGreen", "teamRed", "allPlayerNames", "allDiscordIds", "embedInformation"];
	if (!progressKeys.every(key=> Object.keys(progress).includes(key))) {
		throw new Error(`progress keys are missing\nExpected: ${progressKeys}\nGot: ${Object.keys(progress)}\n`);
	}
	const allowedModes = ["PVP", "PVE"];
	if (!progress.combatRules.mode || progress.combatRules.mode.includes(allowedModes)) {
		throw new Error(`progress.combatRules.mode must be set to ${allowedModes.split(" or ")}\n`);
	}
	if (!progress.combatRules.maxRounds || typeof progress.combatRules.maxRounds !== "number") {
		throw new Error("progress.combatRules.maxRounds must be set to a number\n");
	}
	const weaponInformationKeys = ["numOfAllowedWeapons", "allowedWeapons", "weaponAnswers"];
	if (!weaponInformationKeys.every(key=> Object.keys(progress.weaponInformation).includes(key))) {
		throw new Error(`progress.weaponInformation keys are missing\nExpected: ${weaponInformationKeys}\nGot: ${Object.keys(progress.weaponInformation)}\n`);
	}
	if (progress.weaponInformation.weaponAnswers instanceof Map === false) {
		throw new Error("progress.weaponAnswers must be a Map -> weaponAnswers: new Map\n");
	}
	if (progress.teamGreen.length === 0 || progress.teamRed.length === 0) {
		throw new Error(`No players in the teams. \n teamGreen: ${progress.teamGreen.length} members \n teamRed: ${progress.teamRed.length} members\n`);
	}
	if (progress.allDiscordIds instanceof Set === false || progress.allPlayerNames instanceof Set === false) {
		throw new Error("progress.allDiscordIds and progress.AllPlayerNames must be a Set -> allDiscordIds: new Set\n");
	}
};

module.exports = { createCombatRound };
