const { getIcon } = require("../game/_CONSTS/icons");
/* const { handleRaid } = require("../game/raid"); */
const Raid = require("../combat/advancedClassesCombat/Raid");

module.exports = {
	name: "raid",
	description: `Let's the player hunt the previously explored ${getIcon("raid")}'hunt areas'`,
	shortcuts:{
		h: "Highlanders",
		w: "Wolves",
		fv: "Fishing village",
		cm: "Collapsed Mine",
		bc: "Bandit Camp",
		bv: "Bandit Vault",
	},
	async execute(message, args, user) {
		const place = args.join("").toLowerCase();
		const raid = new Raid({ message, user, place });
		await raid.startCombat();
	},
};
