const calculateStats = require("./calculate-stats");

const pveFullArmy = async (user, npc) => {
	const { totalStats: userStats } = calculateStats(user);
	const combatModifier = (1 - Math.random() / 2);
	const userHp = userStats.health * combatModifier;
	const userAt = userStats.attack * combatModifier;
	const { health: oppHp, attack: oppAt } = npc.stats;

	const losses = (userHp + userAt) - (oppHp + oppAt);
	const win = losses > 0 ? true : false;
	let lossPercentage = ((userHp + userAt) - (oppHp + oppAt)) / (userHp + userAt);
	lossPercentage = lossPercentage < 0 ? 0 : lossPercentage;

	await user.unitLoss(lossPercentage);

	return { win, lossPercentage, combatModifier };
};

// user vs opponent duel with full army (units + hero), returns an object with the winner and loser
const pvpFullArmy = async (user, opp) => {
	const { totalStats: userStats } = calculateStats(user);
	const { health: userHp, attack: userAt } = userStats;
	const { totalStats: oppStats } = calculateStats(opp);
	const { health: oppHp, attack: oppAt } = oppStats;

	const losses = (userHp + userAt) - (oppHp + oppAt);

	// Determine winner
	let loser;
	let winner;

	// User won
	if(losses > 0) {
		let lossPercentage = ((userHp + userAt) - (oppHp + oppAt)) / (userHp + userAt);
		if(!lossPercentage) lossPercentage = 0;
		winner = await user.unitLoss(lossPercentage);
		loser = await opp.unitLoss(0);

	}
	// Opponent won
	else {
		let lossPercentage = ((oppHp + oppAt) - (userHp + userAt)) / (oppHp + oppAt);
		if(!lossPercentage) lossPercentage = 0;
		winner = await opp.unitLoss(lossPercentage);
		loser = await user.unitLoss(0);
	}

	return { winner, loser };
};


module.exports = { pveFullArmy, pvpFullArmy };
