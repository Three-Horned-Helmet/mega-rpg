const sleep = require("util").promisify(setTimeout);
const { generateEmbedCombatRound } = require("./embedGenerator");
const { getWeaponInfo } = require("./helper");
const { asyncForEach, randomIntBetweenMinMax } = require("../../game/_GLOBAL_HELPERS");
/*
Todo:
- Potential issue with object references and teamGreenIds
- Issue with naming in embed. Team green / team red etc
- Potential issue if not deepcopying npc before function call
*/

const createCombatRound = async (message, progress) => {
	if (!progress.teamGreenIds || !progress.teamGreenIds.length) {
		validateProgress(progress);
		populateProgress(progress);
	}

	// eslint-disable-next-line prefer-const
	let { numOfAllowedWeapons, allowedWeapons, weaponAnswers } = progress.weaponInformation;

	allowedWeapons = getWeaponInfo(null, numOfAllowedWeapons);
	progress.weaponInformation.allowedWeapons = allowedWeapons;

	const weaponAnswerFilter = Object.keys(allowedWeapons)
		.map((w) => [allowedWeapons[w].answer, allowedWeapons[w].name])
		.flat();

	const combatRound = generateEmbedCombatRound(progress);
	await message.channel.send(combatRound);

	const filter = (response) => {
		// checks if included in the fight
		return progress.teamGreenIds.includes(response.author.id) || progress.teamRedIds.includes(response.author.id);
	};

	const collector = await message.channel.createMessageCollector(filter, {
		time: 1000 * 10,
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
		if (weaponAnswers.size >= progress.teamRedIds.length + progress.teamGreenIds.length) {
			await sleep(1500);
			collector.stop();
		}
	});
	collector.on("end", async () => {
		const result = await calculateCombatResult(progress);
		if (result.winner) {
			return progress;
		}
		else {
			return await createCombatRound(message, result);
		}
	});
};

const calculateCombatResult = async (progress) => {
	// eslint-disable-next-line prefer-const
	let { teamGreen, teamRed, combatRules } = progress;
	const { weaponAnswers } = progress.weaponInformation;

	// cleans up roundResults from previous round
	progress.roundResults = [];

	const awaitHealPlayerPromises = {};
	const awaitDamagePlayerPromises = {};

	const awaitHealNPCPromises = {};
	const awaitDamageNPCPromises = {};


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
		const victimName = randomVictim.name || randomVictim.account.username;


		if (weaponInfo.chanceforSuccess > chance) {
			if (weaponInfo.type === "attack") {
				const damageGiven = randomIntBetweenMinMax(
					(playerInfo.hero.attack / 2) * weaponInfo.damage,
					playerInfo.hero.attack * weaponInfo.damage
				);
				// playerResult.damageGiven = tempDamageGiven;

				if (combatRules.mode === 'PVP'){

					if (awaitDamagePlayerPromises[victimName]) {
						awaitDamagePlayerPromises[victimName].damage += damageGiven;
					}

					else {
						awaitDamagePlayerPromises[victimName] = {
							user: randomVictim,
							damage: damageGiven,
						};
					}
				}

				if (combatRules.mode === 'PVE'){

					if (awaitDamageNPCPromises[victimName]) {
						awaitDamageNPCPromises[victimName].damage += damageGiven;
					}

					else {
						awaitDamageNPCPromises[victimName] = {
							user: randomVictim,
							damage: damageGiven,
						};
					}
				}

				progress.roundResults.push(
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
					if (awaitHealPlayerPromises[victimName]) {
						awaitHealPlayerPromises[victimName].healGiven += healGiven;
					}
					else {
						awaitHealPlayerPromises[victimName] = {
							user: teamMateWithLowestHp,
							healGiven: healGiven,
						};
					}
				progress.roundResults.push(
					generateHealString(
						playerName,
						weaponInfo,
						healGiven,
						playerHealedName
					)
				);
			}
		}
		else {
			progress.roundResults.push(`\n${playerName} failed to use ${weaponInfo.name} on ${victimName === playerName ? "himself" : victimName}`);
		}
	});

if (combatRules.mode === "PVE"){
	teamRed.forEach(npc=>{
		const allowedNumOfAttacks = npc.allowedNumOfAttacks || 1
		const npcName = npc.name

		for (let i = 0; i < allowedNumOfAttacks; i += 1) {
			const randomVictim =teamGreen[Math.floor(Math.random() * teamGreen.length)];
			
			const weaponNames = Object.keys(progress.weaponInformation.allowedWeapons)
			const randomWeaponName = weaponNames[Math.floor(Math.random()*weaponNames.length)]
			const weaponInfo = getWeaponInfo(randomWeaponName);
			console.log(weaponInfo,'weaponInfo')
			const { stats } = npc;

			if (randomVictim) {
				if (weaponInfo.type === "attack") {
					const tempDamageGiven = randomIntBetweenMinMax(
						stats.attack * weaponInfo.damage,
						(stats.attack / 2) * weaponInfo.damage
					);

					if (awaitDamagePlayerPromises[randomVictim.account.username]) {
						awaitDamagePlayerPromises[randomVictim.account.username].damage += tempDamageGiven;
					}
					else {
						awaitDamagePlayerPromises[randomVictim.account.username] = {
							user: randomVictim,
							damage: tempDamageGiven,
						};
					}
					// removes user from helper array if dead
					if (randomVictim.hero.currentHealth - tempDamageGiven <= 0) {
						progress.dungeon.helperIds = progress.dungeon.helperIds.filter(
							(h) => h !== randomVictim.account.userId
						);
					}
					progress.roundResults.push(
						generateAttackString(
							npcName,
							weaponInfo,
							tempDamageGiven,
							randomVictim.account.username
						)
					);
				}
			}
			if (weaponInfo.type === "heal") {
				const healGiven = randomIntBetweenMinMax(
					stats.health * weaponInfo.damage,
					(stats.health * weaponInfo.damage) / 2
				);
				npcSelfHeal += healGiven;
				progress.roundResults.push(
					generateHealString(npcName, weaponInfo, healGiven)
				);
			}
		}
	})
	}


	// takes care of healing
	Object.keys(awaitHealPlayerPromises).forEach(async (u) => awaitHealPlayerPromises[u].user.healHero(awaitHealPlayerPromises[u].healGiven));

	// inflicts damage on user document
	Object.keys(awaitDamagePlayerPromises).forEach(async (u) => awaitDamagePlayerPromises[u].user.heroHpLossFixedAmount(awaitDamagePlayerPromises[u].damage));

	await asyncForEach(teamGreen, async (member)=>{
		await member.save();
	});
	if (combatRules.mode === 'PVP'){
		await asyncForEach(teamRed, async (member)=>{
			await member.save();
		});
	}
	

	// removes player from combat
	teamGreen = teamGreen.filter(member=>member.hero.currentHealth > 0);
	if (combatRules.mode === 'PVP'){
		teamRed = teamRed.filter(member=>member.hero.currentHealth > 0);
	}
	if (combatRules.mode === 'PVE'){
		teamRed = teamRed.filter(npc=>npc.health > 0);
	}

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

const populateProgress = progress => {
	setupProgressKeys(progress);
	populateDiscordIds(progress);
	populatePlayerNames(progress);
};

const setupProgressKeys = (progress)=>{
	const setup = {
		winner: null,
		roundResults: [],
		currentRound: 0,
		weaponInformation: {
			numOfAllowedWeapons: 3,
			allowedWeapons: null,
			weaponAnswers: new Map,
		},
		teamGreenIds:[],
		teamRedIds: [],
		teamGreenNames: [],
		teamRedNames: [],
	};
	Object.assign(progress, setup);
};


const populateDiscordIds = (progress)=>{
	progress.teamGreen.forEach(member=> progress.teamGreenIds.push(member.account.userId));
	if (progress.combatRules.mode === "PVP") {
		progress.teamRed.forEach(member=> progress.teamRedIds.push(member.account.userId));
	}
};

const populatePlayerNames = (progress)=>{
	progress.teamGreen.forEach(member=> progress.teamGreenNames.push(member.account.username));
	if (progress.combatRules.mode === "PVP") {
		progress.teamRed.forEach(member=> progress.teamRedNames.push(member.account.username));
	}
	if (progress.combatRules.mode === "PVE") {
		progress.teamRed.forEach(member=> progress.teamRedNames.push(member.name));
	}
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

	const progressKeys = ["combatRules", "teamGreen", "teamRed", "embedInformation"];
	if (!progressKeys.some(key=> Object.keys(progress).includes(key))) {
		throw new Error(`progress keys are missing\nExpected: ${progressKeys}\nGot: ${Object.keys(progress)}\n`);
	}
	const allowedModes = ["PVP", "PVE"];
	if (!progress.combatRules.mode || progress.combatRules.mode.includes(allowedModes)) {
		throw new Error(`progress.combatRules.mode must be set to ${allowedModes.split(" or ")}\n`);
	}
	if (!progress.combatRules.maxRounds || typeof progress.combatRules.maxRounds !== "number") {
		throw new Error("progress.combatRules.maxRounds must be set to a number\n");
	}
	if (progress.combatRules.armyAllowed === undefined) {
		throw new Error("progress.combatRules.armyAllowed must be set to a boolean\n");
	}
	if (progress.teamGreen.length === 0 || progress.teamRed.length === 0) {
		throw new Error(`No players in the teams. \n teamGreen: ${progress.teamGreen.length} members \n teamRed: ${progress.teamRed.length} members\n`);
	}
	if (progress.combatRules.mode === "PVE") {
		if (!progress.teamRed.every(member=> {
			const keys = Object.keys(member);
			return keys.includes("name") && keys.includes("stats");
		})) {
			throw new Error("Team red can only have npc in PVE mode. \n NAME or STATS missing from npc");
		}
	}
};

module.exports = { createCombatRound };
