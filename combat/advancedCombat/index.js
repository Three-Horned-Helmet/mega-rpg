const sleep = require("util").promisify(setTimeout);
const { generateEmbedCombatRound } = require("./embedGenerator");
const { getWeaponInfo, getRandomWeapons } = require("../../game/_GLOBAL_HELPERS/weapons");
const { asyncForEach } = require("../../game/_GLOBAL_HELPERS");
const {
	combatSetup,
	checkWinner,
	validateProgress,
	handleAdvancedCombatAttack,
	handleAdvancedCombatHeal,
} = require("./helper");

/*
Todo:
- 'decrypt' npc back to npc form after fight
- Add army options
- Fix teamIds / teammember. Max hp is being calculated wrongly
*/


const createCombatRound = async (message, progress) => {
	// Adds all keys and values needed to do combat
	if (!progress.started) {
		validateProgress(progress);
		combatSetup(progress);
	}

	// eslint-disable-next-line prefer-const
	let { numOfAllowedWeapons, weaponAnswers } = progress.weaponInformation;

	// Gets x random weapons
	const allowedWeapons = getRandomWeapons(numOfAllowedWeapons);
	progress.weaponInformation.allowedWeapons = allowedWeapons;

	const weaponAnswerFilter = Object.keys(allowedWeapons)
		.map((w) => [allowedWeapons[w].answer, allowedWeapons[w].name])
		.flat();


	const combatRound = generateEmbedCombatRound(progress);
	await message.channel.send(combatRound);

	const currentActiveIds = [...progress.teamGreen, ...progress.teamRed].map(player=> player.account.userId);

	const filter = (response) => {
		// checks if person included included in the fight
		return currentActiveIds.includes(response.author.id);
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

		// Allows user to type in a,b,c OR name of the weapon eg 'slash'
		if (Object.keys(allowedWeapons).includes(answer)) {
			weaponAnswers.set(result.author.id, answer);
		}
		else {
			const weaponInformation = Object.values(allowedWeapons).find(
				(w) => w.answer === answer
			);
			weaponAnswers.set(result.author.id, weaponInformation.name);
		}
		// stops collecting if all humans have answered
		if (weaponAnswers.size >= [...progress.teamGreen, ...progress.teamRed].filter(player=> !player.account.npc).length) {
			await sleep(1500);
			collector.stop();
		}
	});
	return await new Promise ((resolve) => {
		collector.on("end", async () => {
			const result = await calculateCombatResult(progress);
			if (Object.values(result.winner).length) {
				await message.channel.send(generateEmbedCombatRound(progress));
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

	// Stores all actions in the variables before saving to database or npc-object
	const awaitHealPlayerPromises = {};
	const awaitDamagePlayerPromises = {};

	// needed for minimal embed view
	const totalRoundInflicted = {
		teamRed: {
			damage: 0,
			heal: 0
		},
		teamGreen: {
			damage: 0,
			heal: 0
		}
	};
	progress.totalRoundInflicted = totalRoundInflicted;

	// adds weapon choice from npc
	[...teamRed, ...teamGreen]
		.filter(player=>player.account.npc)
		.forEach(player=>{
			let weaponName;
			// chooses a random weapon from npc personal arsenal if it exists
			if (player.weapons && player.weapons.length) {
				weaponName = player.weapons[Math.floor(Math.random() * player.weapons.length)];
			}
			// OR chooses a random weapon from the current allowed weapons
			else {
				weaponName = Object.keys(progress.weaponInformation.allowedWeapons)[Math.floor(Math.random() * Object.keys(progress.weaponInformation.allowedWeapons).length)];
			}
			// Saves the answer to the weaponanswer
			weaponAnswers.set(player.account.userId, weaponName);
		});


	// loops through every weaponanswer and performs action
	weaponAnswers.forEach((weapon, playerId) => {
		// allows players with more attack to attack more than once
		const isTeamGreen = teamGreen.some(player=> player.account.userId === playerId);

		// Figure out which team is friendly and which is opposing
		const friendlyTeam = isTeamGreen ? teamGreen : teamRed;
		const opposingTeam = isTeamGreen ? teamRed : teamGreen;

		const playerInfo = friendlyTeam.find((player) => player.account.userId === playerId);
		// allows for multiple attack
		const allowedNumOfAttacks = playerInfo.allowedNumOfAttacks || 1;
		for (let i = 0; i < allowedNumOfAttacks; i += 1) {
			const randomVictimInfo = opposingTeam[Math.floor(Math.random() * opposingTeam.length)];

			// lower chance is better
			const chance = Math.random();
			const weaponInfo = getWeaponInfo(weapon);

			if (weaponInfo.chanceforSuccess > chance) {
				if (weaponInfo.type === "attack") {
					handleAdvancedCombatAttack(playerInfo, weaponInfo, awaitDamagePlayerPromises, randomVictimInfo, progress, isTeamGreen);
				}
				if (weaponInfo.type === "heal") {
					handleAdvancedCombatHeal(playerInfo, friendlyTeam, weaponInfo, awaitHealPlayerPromises, progress, isTeamGreen);
				}
			}
			else {
				const playerName = playerInfo.account.username;
				progress.roundResults.push(`\n**${playerName}** failed to use **${weaponInfo.name}**`);
			}
		}
	});

	// takes care of healing
	Object.keys(awaitHealPlayerPromises).forEach(async (u) => awaitHealPlayerPromises[u].user.healHero(awaitHealPlayerPromises[u].healGiven));
	// takes care of damage infliction
	Object.keys(awaitDamagePlayerPromises).forEach(async (u) => awaitDamagePlayerPromises[u].user.heroHpLossFixedAmount(awaitDamagePlayerPromises[u].damage));


	// performs database save
	await asyncForEach([...teamGreen, ...teamRed].filter(player=>!player.account.npc), async (player) => {
		await player.save();
	});


	// removes player from combat
	progress.teamGreen = progress.teamGreen.filter(player=>player.hero.currentHealth > 0);
	progress.teamRed = progress.teamRed.filter(player=>player.hero.currentHealth > 0);

	progress.currentRound += 1;
	progress.weaponInformation.weaponAnswers.clear();

	// checks if fight is over
	progress.winner = checkWinner(progress);
	return progress;
};


module.exports = { createCombatRound };
