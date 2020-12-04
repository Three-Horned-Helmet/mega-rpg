const { randomIntBetweenMinMax } = require("../../game/_GLOBAL_HELPERS");
const { getIcon } = require("../../game/_CONSTS/icons");

const generateAttackString = (playerName, weaponInfo, damageGiven, playerAttacked) => {
	const attacker = playerName.length > 13 ? `${playerName.substring(0, 10)}..` : playerName;
	const victim = playerAttacked.length > 13 ? `${playerAttacked.substring(0, 10)}..` : playerAttacked;
	return `\n**${attacker}** ${getIcon(weaponInfo.name)} **${victim}** :boom: **${damageGiven}** dmg`;

};
const generateHealString = (playerName, weaponInfo, healGiven, playerHealed) => {
	const healer = playerName.length > 13 ? `${playerName.substring(0, 11)}..` : playerName;
	const victim = playerHealed.length > 13 ? `${playerHealed.substring(0, 11)}..` : playerHealed;
	return `\n**${healer}** ${getIcon(weaponInfo.name)} **${victim}**. **+${healGiven}** HP`;
};

const combatSetup = progress => {
	setupProgressKeys(progress);
	convertNpcsToHuman(progress);
	storeOriginalTeams(progress);
	formatEmbedInformation(progress);
};

// To see the starting maxhp
const storeOriginalTeams = (progress)=>{
	const originalRedTeam = JSON.parse(JSON.stringify(progress.teamRed)).map(getPlayerEssentials);
	const originalGreenTeam = JSON.parse(JSON.stringify(progress.teamGreen)).map(getPlayerEssentials);

	progress.originalGreenTeam = originalGreenTeam;
	progress.originalRedTeam = originalRedTeam;
};
const getPlayerEssentials = playerObj => {
	return {
		account: {
			username: playerObj.account.username,
			userId: playerObj.account.userId },
		hero: {
			rank: playerObj.hero.rank,
			currentHealth: playerObj.hero.currentHealth,
			health: playerObj.hero.health
		}
	};
};

const formatEmbedInformation = (progress)=> {
	const { embedInformation } = progress;
	embedInformation.minimal = embedInformation.minimal || false;
	embedInformation.teamRedName = embedInformation.teamRedName || "Team Red";
	embedInformation.teamGreenName = embedInformation.teamGreenName || "Team Green";
	embedInformation.title = embedInformation.title || `BATTLE! - ${embedInformation.teamRedName} VS ${embedInformation.teamGreenName}`;
	embedInformation.description = embedInformation.description || "";
	embedInformation.fields = embedInformation.fields || [];
	embedInformation.footer = embedInformation.footer || "TIP: Write your weapon of choice in the chat. eg -> a or c";

	return progress;

};

const convertNpcsToHuman = (progress) => {
	progress.teamRed.map(player=> {
		if (!player.account) return convertNpc(player);
	});
	progress.teamGreen.map(player=> {
		if (!player.account) return convertNpc(player);
	});
};

const convertNpc = (npc)=> {
	if (!npc.account) {
		npc.account = {
			userId: Math.random().toString(36).substr(2, 10),
			username: npc.name,
			npc: true,
		};
	}
	if (!npc.hero) {
		npc.hero = {
			health: npc.stats.health,
			currentHealth: npc.stats.health,
			attack: npc.stats.attack
		};
	}
	if (!npc.army) {
		npc.army = {
			units: {
				archery: {},
				barracks: {}
			},
			armory : {
				chest : {},
				helmet : {},
				legging : {},
				weapon : {}
			}
		};
	}


	npc.heroHpLossFixedAmount = function(hp) {
		this.hero.currentHealth -= hp;
		if (this.hero.currentHealth < 0) {
			this.hero.currentHealth = 0;
		}
	};
	npc.healHero = function(hp) {
		this.hero.currentHealth += hp;
		if (this.hero.currentHealth > this.hero.health) {
			this.hero.currentHealth = this.hero.health;
		}
	};

	npc.stats = null;
	npc.name = null;
	return npc;
};


const setupProgressKeys = (progress)=>{
	const setup = {
		started: true,
		winner: {},
		roundResults: [],
		currentRound: 0,
		weaponInformation: {
			numOfAllowedWeapons: 3,
			allowedWeapons: null,
			weaponAnswers: new Map,
		},
	};
	Object.assign(progress, setup);
};

const checkWinner = progress=>{
	const{ teamGreen, teamRed } = progress;
	if (teamGreen.length === 0 && teamRed.length === 0) {
		return { victory: "draw", msg: "draw!" };
	}
	if (teamGreen.length === 0 || teamRed.length === 0) {
		return teamGreen.length === 0 ? { victory: "red", msg: `Winner: ${progress.embedInformation.teamRedName}!` } : { victory: "green", msg:`Winner: ${progress.embedInformation.teamGreenName}!` };
	}
	if (progress.currentRound >= progress.combatRules.maxRounds) {
		return { victory: "none", msg: "No Winners!" };
	}
	return {};
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
		throw new Error(`No players in the teams. \n teamGreen: ${progress.teamGreen.length} players \n teamRed: ${progress.teamRed.length} players\n`);
	}
};

const handleAdvancedCombatAttack = (playerInfo, weaponInfo, awaitDamagePlayerPromises, randomVictimInfo, progress, isTeamGreen) =>{
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
	if (isTeamGreen) {
		progress.totalRoundInflicted.teamGreen.damage += damageGiven;
	}
	else {
		progress.totalRoundInflicted.teamRed.damage += damageGiven;
	}
	progress.roundResults.push(generateAttackString(playerName, weaponInfo, damageGiven, victimName)
	);

};

const handleAdvancedCombatHeal = (playerInfo, friendlyTeam, weaponInfo, awaitHealPlayerPromises, progress, isTeamGreen)=>{
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
	if (isTeamGreen) {
		progress.totalRoundInflicted.teamGreen.damage += healGiven;
	}
	else {
		progress.totalRoundInflicted.teamRed.damage += healGiven;
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

/* const allPlayersAlive = progress => {
	const { teamGreen, teamRed } = progress;
	return [...teamGreen, ...teamRed].every(player=>{
		return player.hero.currentHealth > 0;
	});
}; */

module.exports = {
	combatSetup,
	formatEmbedInformation,
	checkWinner,
	validateProgress,
	handleAdvancedCombatAttack,
	handleAdvancedCombatHeal,
};