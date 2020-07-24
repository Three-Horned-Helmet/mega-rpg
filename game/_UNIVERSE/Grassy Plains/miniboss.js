module.exports = { "C'Thun": {
	name: "C'Thun",
	type: "miniboss",
	stats:{
		attack: 90,
		health: 100,
		difficulty: 10,
	},
	rewards:{
		dungeonKey: "CM Key",
		gold: 120,
		xp: 500,
	},
	rules: {
		canKill:true,
		allowArmy:false,
		allowHelpers:true,
		minRankToGetKey: 2,
	},
	helperIds:[],
}, };