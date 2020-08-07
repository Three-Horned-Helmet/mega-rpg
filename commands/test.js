const { createCombatRound } = require("../combat/advancedCombat");
const User = require("../models/User");


const templateProgress = {
	combatRules:{
		mode: "PVE", // ["PVP","PVE"]
		armyAllowed: false,
		maxRounds: 3
	},
	teamGreen:[], // Users from db
	teamRed:[], // Users from db OR npc
	embedInformation:{
		teamRed:"",
		teamGreen:"",
		title:"",
		description:"",
		fields:{},
		footer:"",
	},
};


module.exports = {
	name: "test",
	description: "dev tool",
	async execute(message, args, user) {
		const t = await User.findOne({ "account.username":"SpinningSiri" });

		templateProgress.teamGreen.push(t);
		templateProgress.teamRed.push({
			name: "Bandit Prince",
			stats: {
				attack: 73,
				health: 2000,
				maxHealth: 2000
			}
		})
		return await createCombatRound(message, templateProgress);
	},
};