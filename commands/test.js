/* eslint-disable no-inline-comments */

const { createCombatRound } = require("../combat/advancedCombat");
const { getArmyTowerEnemies } = require("../game/tower/army-tower/army-tower-enemies/army-tower-enemies");
const User = require("../models/User");


module.exports = {
	name: "test",
	description: "dev tool",
	async execute(message, args, user) {
		const devs = ["SpinningSiri", "Ignore"];
		if (!devs.includes(message.author.username)) {
			return;
		}

		const t = await User.findOne({ "account.username":"SpinningSiri" });
		const m = await User.findOne({ "account.username":"Ignore" });

		const npc = getArmyTowerEnemies(Math.floor(Math.random() * 100));
		const npc2 = getArmyTowerEnemies(Math.floor(Math.random() * 100));
		const npc3 = getArmyTowerEnemies(Math.floor(Math.random() * 100));
		const npc4 = getArmyTowerEnemies(Math.floor(Math.random() * 100));

		const progress = {
			combatRules:{
				armyAllowed: false,
				maxRounds: 3
			},
			teamGreen:[m, npc, npc2],
			teamRed:[t, npc3, npc4],
			embedInformation:{}
		};

		return await createCombatRound(message, progress);
	},
};