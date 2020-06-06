const calculateStats = require("./calculate-stats");

const pveFullArmy = (user, npc) => {
};

const pvpFullArmy = (user, opp) => {
	const { totalStats: userStats } = calculateStats(user);
	const { currentHealth: userHp, attack: userAt } = userStats;
	const { totalStats: oppStats } = calculateStats(opp);
	const { currentHealth: oppHp, attack: oppAt } = oppStats;

	const losses = (userHp + userAt) - (oppHp + oppAt);

	// Determine winner
	let winner;
	let lossPercentage;
	if(losses > 0) {
		winner = user;
		lossPercentage = ((userHp + userAt) - (oppHp + oppAt)) / (userHp + userAt);
	}
	else {
		winner = opp;
		lossPercentage = ((oppHp + oppAt) - (userHp + userAt)) / (oppHp + oppAt);
	}
};

module.exports = { combatPve, combatPvp };