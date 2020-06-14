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
       battleStats.win ? await user.gainResource("gold", goldGain) : await opponent.gainResource("gold", goldGain);
   }

   return { embed: duelEmbed(user, opponent, battleStats, goldGain, expGain) };
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