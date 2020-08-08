/* eslint-disable no-inline-comments */

const { createCombatRound } = require("../combat/advancedCombat");
const User = require("../models/User");

const templateProgress = {
	combatRules:{
		mode: "PVP", // ["PVP","PVE"]
		armyAllowed: false,
		maxRounds: 3 // combat will end after fight this many times
	},
	teamGreen:[], // Users from db
	teamRed:[], // Users from db OR npc
	embedInformation:{ // embed information that will be displayed during combat
		teamRed:"",
		teamGreen:"",
		title:"",
		description:"",
		fields:[],
		footer:"",
	}
};


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

		// const npc = {
		//	name: "Bandit Prince",
		//	stats: {
		//		attack: 73,
		//		health: 2000,
		//		maxHealth: 2000
		//	}
		// };

		templateProgress.teamGreen.push(t);
		templateProgress.teamRed.push(m);

		// templateProgress.teamRed.push(npc)

		return await createCombatRound(message, templateProgress);
	},
};