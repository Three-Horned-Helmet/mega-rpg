const calculateStats = require("./calculate-stats");

const pveFullArmy = (user, npc) => {
};

// user vs opponent duel with full army (units + hero), returns an object with the winner and loser
const pvpFullArmy = async (user, opp) => {
	const { totalStats: userStats } = calculateStats(user);
	const { health: userHp, attack: userAt } = userStats;
	const { totalStats: oppStats } = calculateStats(opp);
	const { health: oppHp, attack: oppAt } = oppStats;

	console.log("MARKUS", oppStats, userStats);

	const losses = (userHp + userAt) - (oppHp + oppAt);

	// Determine winner
	let loser;
	let winner;

	// User won
	if(losses > 0) {
		const lossPercentage = ((userHp + userAt) - (oppHp + oppAt)) / (userHp + userAt);
		console.log("LOSS PER", lossPercentage);
		winner = await user.unitLoss(lossPercentage);
		loser = await opp.unitLoss(0);

	}
	// Opponent won
	else {
		const lossPercentage = ((oppHp + oppAt) - (userHp + userAt)) / (oppHp + oppAt);
		winner = await opp.unitLoss(lossPercentage);
		loser = await user.unitLoss(0);
	}

	return { winner, loser };
};


module.exports = { pveFullArmy, pvpFullArmy };