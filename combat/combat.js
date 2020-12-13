const calculateStats = require("./calculate-stats");
// todo, 0 exp if dead

// Takes the user and the npc and battles the npc with only the hero at a 50-100% modifier
// Returns win (bolean), lossPercentage (1 = 100% loss of hero hp), and the combat modifier
const calculatePveHero = (user, npc) => {
	const { heroStats } = calculateStats(user);
	const combatModifier = 1 - Math.random() / 3;
	const userHp = heroStats.currentHealth * combatModifier;
	const userAt = heroStats.attack * combatModifier;
	const { health: oppHp, attack: oppAt } = npc.stats;

	const losses = userHp + userAt - (oppHp + oppAt);
	const win = losses > 0;
	let lossPercentage = (userHp + userAt - (oppHp + oppAt)) / (userHp + userAt);
	if(lossPercentage < 0) lossPercentage = 0;

	const damageLost = Math.abs(Math.round(lossPercentage * user.hero.currentHealth - user.hero.currentHealth));

	const pveResult = {
		combatModifier,
		expReward: 0,
		levelUp: false,
		heroDemote: false,
		lossPercentage:  lossPercentage,
		resourceReward: {},
		win,
		damageLost,
	};

	if (win) {
		pveResult.resourceReward = Object.keys(npc.rewards).reduce((acc, cur) => {
			const randomReward = Math.ceil(
				Math.random() * npc.rewards[cur] + npc.rewards[cur] / 2
			);
			acc[cur] = randomReward;
			return acc;
		}, {});
		pveResult.expReward = Math.ceil(
			Math.random() * (npc.stats.attack + npc.stats.health) / 2
		);
	}
	else {
		pveResult.expReward = Math.ceil(Math.random() * 5);
		if (user.hero.rank > 0 && damageLost + user.hero.currentHealth >= user.hero.health) {
			pveResult.levelUp = false;
			pveResult.expReward = 0;
			pveResult.heroDemote = true;
		}
	}

	// checks if hero has leveld up
	if (pveResult.expReward + user.hero.currentExp >= user.hero.expToNextRank) {
		pveResult.levelUp = true;
	}

	return pveResult;
};

// Takes the user and the npc and battles the npc with the full army at a 50-100% modifier
// Returns win (bolean), lossPercentage (1 = 100% loss of units), and the combat modifier
const calculatePveFullArmyResult = (user, npc) => {
	const { totalStats } = calculateStats(user);
	const combatModifier = 1 - Math.random() / 2;
	const userHp = totalStats.health * combatModifier;
	const userAt = totalStats.attack * combatModifier;
	const { health: oppHp, attack: oppAt } = npc.stats;

	const losses = userHp + userAt - (oppHp + oppAt);
	const win = losses > 0;
	let lossPercentage = losses / (userHp + userAt);
	if(lossPercentage < 0) lossPercentage = 0;
	const { username, userId } = user.account;
	const damageLost = Math.abs(Math.round(lossPercentage * user.hero.currentHealth - user.hero.currentHealth));

	const pveResult = {
		combatModifier,
		expReward: 0,
		levelUp: false,
		heroDemote: false,
		lossPercentage: lossPercentage,
		resourceReward: {},
		remainingForces: losses > 0 ? 0 : Math.floor(Math.abs(losses)),
		win,
		username,
		userId,
		damageLost
	};

	// generates a random reward number
	if (win) {
		if(npc.rewards) {
			pveResult.resourceReward = Object.keys(npc.rewards).reduce((acc, cur) => {
				const randomReward = Math.ceil(
					Math.random() * npc.rewards[cur] + npc.rewards[cur] / 2
				);
				acc[cur] = randomReward;
				return acc;
			}, {});
		}
		pveResult.expReward = Math.ceil(
			(Math.random() * (npc.stats.attack + npc.stats.health)) / 2
		);
	}
	else {
		pveResult.expReward = Math.ceil(Math.random() * 10);
		if (user.hero.rank > 0 && damageLost + user.hero.currentHealth >= user.hero.health) {
			pveResult.levelUp = false;
			pveResult.expReward = 0;
			pveResult.heroDemote = true;
		}
	}

	// checks if hero has leveld up
	if (pveResult.expReward + user.hero.currentExp >= user.hero.expToNextRank) {
		pveResult.levelUp = true;
	}
	return pveResult;
};

// user vs opponent duel with full army (units + hero), returns an object with the winner and loser
const duelFullArmy = (user, opp) => {
	// Get player stats and add modifier
	const { totalStats: userStats } = calculateStats(user);
	// Combat modifier
	const uModifier = 1 - Math.random() / 2;
	const userHp = userStats.health * uModifier;
	const userAt = userStats.attack * uModifier;

	const { totalStats: oppStats } = calculateStats(opp);
	const oModifier = 1 - Math.random() / 2;
	const oppHp = oppStats.health * oModifier;
	const oppAt = oppStats.attack * oModifier;

	const winMargin = Math.floor(userHp + userAt - (oppHp + oppAt));

	// Determine winner
	const win = winMargin > 0;

	return { win, winMargin: Math.abs(winMargin), uModifier, oModifier };
};

module.exports = { calculatePveFullArmyResult, calculatePveHero, duelFullArmy };
