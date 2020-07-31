const {
	generateEmbedCombatRound,
	generateEmbedCombatResult,
} = require("./embedGenerator");
const { getWeaponInfo } = require("./helper");
const { asyncForEach, randomIntBetweenMinMax } = require("../_GLOBAL_HELPERS/");


const templateProgress = {
	finish:false,
	roundResults:[],
	combatRules:{
		mode: "PVP", // ["PVP","PVE"]
		currentRound:0,
		maxRounds: 3
	},
	weaponInformation:{
		numOfAllowedWeapons: 3,
		allowedWeapons: null,
		weaponAnswers: new Map,
	},
	teamGreen:[],
	teamRed:[],
	allDiscordIds:new Set,
};

const createCombatRound = async (message, progress) => {
	// validate progress object

	// eslint-disable-next-line prefer-const
	let { numOfAllowedWeapons, allowedWeapons, weaponAnswers } = progress.weaponInformation;

	if (progress.allDiscordIds.size === 0) {
		populateDiscordIds(progress);
	}
	allowedWeapons = getWeaponInfo(null, numOfAllowedWeapons);

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
		if (result.finish) {
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


	// takes care of healing
	await asyncForEach(Object.keys(awaitHealPromises), async (u) => {
		return await awaitHealPromises[u].user.healHero(
			awaitHealPromises[u].healGiven
		);
	});

	// inflicts damage on user document
	await asyncForEach(Object.keys(awaitDamagePromises), async (u) => {
		return await awaitDamagePromises[u].user.heroHpLossFixedAmount(
			awaitDamagePromises[u].damage
		);
	});

	// removes player from combat
	progress.teamGreen.filter(member=>member.hero.currentHealth > 0);
	progress.teamRed.filter(member=>member.hero.currentHealth > 0);

	progress.bossAttempts += 1;
	progress.weaponAnswers.clear();

	// checks if fight is over
	if (teamGreen.length === 0 || teamRed.length === 0) {
		progress.finish = true;
		if (progress.bossAttempts > 3) {
			progress.winner = "No winners";
		}
		if (teamGreen.lenth === 0 && teamRed.length === 0) {
			progress.winner = "draw";
		}
		else {
			progress.winner = teamGreen.length === 0 ? "teamRed" : "teamGreen";
		}
	}


	return progress;
};

const generateAttackString = (
	playerName,
	weaponInfo,
	damageGiven,
	playerAttacked
) => {
	const string = `\n- **${playerName}** used ${weaponInfo.name} attack causing **${damageGiven}** damage to **${playerAttacked}**`;
	return string;
};
const generateHealString = (
	playerName,
	weaponInfo,
	healGiven,
	playerHealed
) => {

	return `\n${playerName} helead ${playerHealed === playerName ? "himself" : playerHealed}. +${healGiven} HP`;
};


const populateDiscordIds = (progress)=>{
	progress.teamGreen.forEach(member=> progress.allDiscordIds.add(member.account.userid));
	progress.teamRed.forEach(member=> progress.allDiscordIds.add(member.account.userid));

};

module.exports = { createCombatRound };
