const { onCooldown } = require("../_CONSTS/cooldowns");
const { duelFullArmy } = require("../../combat/combat");
const calculateStats = require("../../combat/calculate-stats");
const { gainHeroExp } = require("../_CONSTS/hero-exp");
const duelEmbed = require("./duel-embed");

const duelPlayer = async (user, opponent, msg) =>{
	const { response, message } = checkIfDuelIsPossible(user, opponent);
	if(!response) return message;

	await user.setNewCooldown("duel", new Date());

	const battleStats = duelFullArmy(user, opponent);

	const { totalStats:oppStats } = calculateStats(opponent);
	const { totalStats: userStats } = calculateStats(user);
	battleStats.oppStats = oppStats;
	battleStats.userStats = userStats;

	const gainsModifier = battleStats.win ? (oppStats.health + oppStats.attack) / (userStats.health + userStats.attack) :
		(userStats.health + userStats.attack) / (oppStats.health + oppStats.attack);
	const expGain = Math.floor(Math.random() * 20 * gainsModifier);
	const goldGain = Math.floor(Math.random() * 10 * gainsModifier);

	if(gainsModifier) {
		await gainHeroExp(battleStats.win ? user : opponent, expGain, msg);
		if (battleStats.win) {
			user.gainManyResources({ gold: goldGain });
			await user.save();
		}
		else {
			opponent.gainManyResources({ gold: goldGain });
			await opponent.save();
		}
	}

	return { embed: duelEmbed(user, opponent, battleStats, goldGain, expGain) };
};

const checkIfDuelIsPossible = (user, opponent) =>{
	if(!opponent || user.account.userId === opponent.account.userId) {
		return {
			response: false,
			message: "Invalid opponent to duel. Usage `!duel @player`. Remember the '@' before the name of the player.",
		};
	}

	const cd = onCooldown("duel", user);
	if (cd.response) {
		return { response: false, message: cd };
	}

	return { response: true };
};

module.exports = duelPlayer;