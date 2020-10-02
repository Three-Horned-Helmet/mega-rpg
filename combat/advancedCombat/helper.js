const { randomIntBetweenMinMax } = require("../../game/_GLOBAL_HELPERS");

const generateAttackString = (playerName, weaponInfo, damageGiven, playerAttacked) => {
	return `\n- **${playerName}** used ${weaponInfo.name} attack causing **${damageGiven}** damage to **${playerAttacked}**`;

};
const generateHealString = (playerName, weaponInfo, healGiven, playerHealed) => {
	return `\n**${playerName}** helead **${playerHealed === playerName ? "himself" : playerHealed}**. **+${healGiven}** HP`;
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
	embedInformation.description = embedInformation.description || "";
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
			}
		};
	}

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
	if (progress.currentRound >= progress.combatRules.maxRounds) {
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

module.exports = {
	combatSetup,
	formatEmbedInformation,
	checkWinner,
	validateProgress,
	handleAdvancedCombatAttack,
	handleAdvancedCombatHeal,
	allPlayersAlive
};