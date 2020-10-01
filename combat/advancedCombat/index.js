const sleep = require("util").promisify(setTimeout);
const { generateEmbedCombatRound } = require("./embedGenerator");
const { getWeaponInfo } = require("./helper");
const { asyncForEach, randomIntBetweenMinMax } = require("../../game/_GLOBAL_HELPERS");
/*
Todo:
- 'decrypt' npc back to npc form after fight
*/


const createCombatRound = async (message, progress) => {
	if (!progress.started) {
		validateProgress(progress);
		combatSetup(progress);
	}
	/* if (!allPlayersAlive(progress)) {
		return message.channel.send("Dead players can't join fight");
	} */

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
	return await new Promise ((resolve) => {
		collector.on("end", async () => {
			const result = await calculateCombatResult(progress);
			if (result.winner) {
				resolve(progress);
			}
			else {
				resolve(await createCombatRound(message, result));
			}
		});
	});
};

const calculateCombatResult = async (progress) => {
	// eslint-disable-next-line prefer-const
	let { teamGreen, teamRed } = progress;
	const { weaponAnswers } = progress.weaponInformation;

	// cleans up roundResults from previous round
	progress.roundResults = [];

	const awaitHealPlayerPromises = {};
	const awaitDamagePlayerPromises = {};

	// adds weapon choice from npc
	// clean this
	[...teamRed, ...teamGreen]
		.filter(player=>player.account.npc)
		.forEach(player=>{
			const weaponInformation = Object.values(progress.weaponInformation.allowedWeapons).find(
				(weapon) => weapon.answer === "a"
			);
			weaponAnswers.set(player.account.userId, weaponInformation.name);
		});


	// loops through every weaponanswer and performs action
	weaponAnswers.forEach((weapon, player) => {
		// allows players with more attack to attack more than once
		const allowedNumOfAttacks = player.allowedNumOfAttacks || 1;
		for (let i = 0; i < allowedNumOfAttacks; i += 1) {

			const isTeamGreen = teamGreen.some(member=> member.account.userId === player);

			// Figure out which team is friendly and which is opposing
			const friendlyTeam = isTeamGreen ? teamGreen : teamRed;
			const opposingTeam = isTeamGreen ? teamRed : teamGreen;

			const playerInfo = friendlyTeam.find((member) => member.account.userId === player);
			const randomVictimInfo = opposingTeam[Math.floor(Math.random() * teamRed.length)];

			// lower chance is better
			const chance = Math.random();
			const weaponInfo = getWeaponInfo(weapon);
			const playerName = playerInfo.account.username;
			const victimName = randomVictimInfo.account.username;

			if (weaponInfo.chanceforSuccess > chance) {
				if (weaponInfo.type === "attack") {
					handleAdvancedCombatAttack(playerInfo, weaponInfo, awaitDamagePlayerPromises, randomVictimInfo, progress);
				}
				if (weaponInfo.type === "heal") {
					handleAdvancedCombatHeal(playerInfo, friendlyTeam, weaponInfo, awaitHealPlayerPromises, progress);
				}
			}
			else {
				progress.roundResults.push(`\n${playerName} failed to use ${weaponInfo.name} on ${victimName === playerName ? "himself" : victimName}`);
			}
		}
	});

	// takes care of healing
	Object.keys(awaitHealPlayerPromises).forEach(async (u) => awaitHealPlayerPromises[u].user.healHero(awaitHealPlayerPromises[u].healGiven));

	// inflicts damage on user document
	Object.keys(awaitDamagePlayerPromises).forEach(async (u) => awaitDamagePlayerPromises[u].user.heroHpLossFixedAmount(awaitDamagePlayerPromises[u].damage));


	// performs database save
	await asyncForEach([...teamGreen, ...teamRed].filter(player=>!player.account.npc), async (player) => {
		await player.save();
	});


	// removes player from combat
	teamGreen = teamGreen.filter(member=>member.hero.currentHealth > 0);
	teamRed = teamRed.filter(member=>member.hero.currentHealth > 0);
	console.log(progress.currentRound);
	progress.currentRound += 1;
	console.log(progress.currentRound, "progress.currentRound");
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

const combatSetup = progress => {
	setupProgressKeys(progress);
	convertNpcsToHuman(progress);
	populateDiscordIds(progress);
	populatePlayerNames(progress);
	formatEmbedInformation(progress);
};

const formatEmbedInformation = (progress)=> {
	const { embedInformation } = progress;
	embedInformation.teamRedName = embedInformation.teamRedName || "Team Red";
	embedInformation.teamGreenName = embedInformation.teamGreenName || "Team Green";
	embedInformation.title = embedInformation.title || "BATTLE!";
	embedInformation.description = embedInformation.description || "Here is description";
	embedInformation.fields = embedInformation.fields || [];
	embedInformation.footer = embedInformation.footer || "TIP: Write your weapon of choice in the chat. eg -> a or c";

	return progress;

};

const convertNpcsToHuman = (progress) => {
	progress.teamRed.map(member=> {
		if (!member.account) return convertNpc(member);
	});
	progress.teamGreen.map(member=> {
		if (!member.account) return convertNpc(member);
	});
};

const convertNpc = (npc)=> {
	npc.account = {
		userId: Math.random().toString(36).substr(2, 10),
		username: npc.name,
		npc: true,
	};
	npc.hero = {
		health: npc.stats.health,
		currentHealth: npc.stats.health,
		attack: npc.stats.attack
	};

	npc.heroHpLossFixedAmount = function(hp) {
		this.currentHealth -= hp;
	};
	npc.healHero = function(hp) {
		this.currentHealth += hp;
	};

	npc.stats = null;
	npc.name = null;
	return npc;

};


const setupProgressKeys = (progress)=>{
	const setup = {
		started: true,
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
	progress.teamRed.forEach(member=> progress.teamRedIds.push(member.account.userId));
};

const populatePlayerNames = (progress)=>{
	progress.teamGreen.forEach(member=> progress.teamGreenNames.push(member.account.username));
	progress.teamRed.forEach(member=> progress.teamRedNames.push(member.account.username));
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
	if (!progress.combatRules.maxRounds || typeof progress.combatRules.maxRounds !== "number") {
		throw new Error("progress.combatRules.maxRounds must be set to a number\n");
	}
	if (progress.combatRules.armyAllowed === undefined) {
		throw new Error("progress.combatRules.armyAllowed must be set to a boolean\n");
	}
	if (progress.teamGreen.length === 0 || progress.teamRed.length === 0) {
		throw new Error(`No players in the teams. \n teamGreen: ${progress.teamGreen.length} members \n teamRed: ${progress.teamRed.length} members\n`);
	}
};

const handleAdvancedCombatAttack = (playerInfo, weaponInfo, awaitDamagePlayerPromises, randomVictimInfo, progress) =>{
	const victimName = randomVictimInfo.account.username;
	const playerName = playerInfo.account.username;
	const damageGiven = randomIntBetweenMinMax(
		(playerInfo.hero.attack / 2) * weaponInfo.damage,
		playerInfo.hero.attack * weaponInfo.damage
	);
	if (awaitDamagePlayerPromises[victimName]) {
		awaitDamagePlayerPromises[victimName].damage += damageGiven;
	}
	else {
		awaitDamagePlayerPromises[victimName] = {
			user: randomVictimInfo,
			damage: damageGiven,
		};
	}
	progress.roundResults.push(generateAttackString(playerName, weaponInfo, damageGiven, victimName)
	);

};

const handleAdvancedCombatHeal = (playerInfo, friendlyTeam, weaponInfo, awaitHealPlayerPromises, progress)=>{
	const playerName = playerInfo.account.username;
	const teamMateWithLowestHp = friendlyTeam
		.sort((a, b)=> a.hero.currentHealth - b.hero.currentHealth)
		.filter((p)=> p.hero.currentHealth > 0)[0];
	const teamMateName = teamMateWithLowestHp.account.username;

	const playerHealedName = teamMateWithLowestHp.account.username;
	const healGiven = randomIntBetweenMinMax(
		(playerInfo.hero.health * weaponInfo.damage) / 2,
		playerInfo.hero.health * weaponInfo.damage
	);
	if (awaitHealPlayerPromises[teamMateName]) {
		awaitHealPlayerPromises[teamMateName].healGiven += healGiven;
	}
	else {
		awaitHealPlayerPromises[teamMateName] = {
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
};

const allPlayersAlive = progress => {
	const { teamGreen, teamRed } = progress;
	return [...teamGreen, ...teamRed].every(player=>{
		return player.hero.currentHealth > 0;
	});
};

module.exports = { createCombatRound };
