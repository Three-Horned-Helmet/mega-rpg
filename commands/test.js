/* eslint-disable no-inline-comments */

/* const { createCombatRound } = require("../combat/advancedCombat"); */
/* const { handleMiniboss } = require("../game/miniboss") */
const { preGameHandler } = require("../combat/advancedClassesCombat");
/* const { getArmyTowerEnemies } = require("../game/tower/army-tower/army-tower-enemies/army-tower-enemies"); */
const User = require("../models/User");


module.exports = {
	name: "test",
	description: "dev tool",
	async execute(message, args, user) {
		const devs = ["SpinningSiri", "Ignore"];
		if (!devs.includes(message.author.username)) {
			return;
		}

		// const t = await User.findOne({ "account.username":"SpinningSiri" });
		const m = await User.findOne({ "account.username":"SpinningSiri" });
		m.hero.className = "Mage";
		const npc = {
			_id: "p-4",
			isNpc: true,
			account: {
				username: "Player Four"
			},
			hero: {
				rank: 3,
				health: 180,
				currentHealth: 10,
				attack: 30,
				defense: 30,
				className: "Mage"
			}
		};
		const additionalRewards = {
			exp: 400,
			gold: 200
		};
		return preGameHandler(message, [m], [npc], { additionalRewards });
	},
};