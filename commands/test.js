const { createCombatRound } = require("../combat/advancedCombat");
const User = require("../models/User");


const templateProgress = {
	combatRules:{
		mode: "PVP", // ["PVP","PVE"]
		armyAllowed: false,
		maxRounds: 3
	},
	teamGreen:[],
	teamRed:[],
	embedInformation:{
		teamRed:"",
		teamGreen:"",
		title:"",
		description:"",
		fields:"",
		footer:"",
	},
};


module.exports = {
	name: "test",
	description: "dev tool",
	async execute(message, args, user) {
		const t = await User.findOne({ "account.username":"SpinningSiri" });
		const m = await User.findOne({ "account.username":"Ignore" });
		templateProgress.teamGreen.push(t);
		templateProgress.teamRed.push(m);
		return await createCombatRound(message, templateProgress);
	},
};