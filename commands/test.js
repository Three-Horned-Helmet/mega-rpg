const { createCombatRound } = require("../combat/advancedCombat");
const User = require("../models/User");

const templateProgress = {
	winner:null,
	roundResults:[],
	currentRound:0,
	combatRules:{
		mode: "PVP", // ["PVP","PVE"]
		maxRounds: 3
	},
	weaponInformation:{
		numOfAllowedWeapons: 3,
		allowedWeapons: null,
		weaponAnswers: new Map,
	},
	teamGreen:[],
	teamRed:[],
	allDiscordIds:new Set,
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