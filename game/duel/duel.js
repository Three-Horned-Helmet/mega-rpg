const { onCooldown } = require("../_CONSTS/cooldowns");
const { duelFullArmy } = require("../../combat/combat");
const calculateStats = require("../../combat/calculate-stats");
const { gainHeroExp } = require("../_CONSTS/hero-exp");

const duelPlayer = async (user, opponent, msg) =>{
   const { response, message } = checkIfDuelIsPossible(user, opponent);
   if(!response) return message;

   await user.setNewCooldown("duel", new Date());

   const battleResult = duelFullArmy(user, opponent);

   if(battleResult.win) {
        const { totalStats:oppStats } = calculateStats(opponent);
        const { totalStats: userStats } = calculateStats(user);
        const gainsModifier = (oppStats.health + oppStats.attack) / (userStats.health + userStats.attack);
        const expGain = Math.floor(Math.random() * 20 * gainsModifier);
        const goldGain = Math.floor(Math.random() * 10 * gainsModifier);

        if(gainsModifier) {
            await gainHeroExp(user, expGain, msg);
            await user.gainResource("gold", goldGain);
        }

        return `You won the duel against ${opponent.account.username} and gained ${expGain} exp and ${goldGain} gold!`;
   }
   return `You lost the duel against ${opponent.account.username}`;
};

const checkIfDuelIsPossible = (user, opponent) =>{
    if(!opponent) {
        return {
            response: false,
            message: "Invalid opponent to duel",
        };
    }

    const cd = onCooldown("duel", user);
	if (cd.response) {
		return { response: false, message: cd };
    }

    return { response: true };
};

module.exports = duelPlayer;