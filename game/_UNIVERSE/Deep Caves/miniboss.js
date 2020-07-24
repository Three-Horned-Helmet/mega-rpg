module.exports = { "Kraken": {
	name: "Kraken",
	type: "miniboss",
	stats:{
		attack: 1800,
		health: 1800,
		difficulty: 90,
	},
	rewards:{
		dungeonKey: "The One Shell",
		gold: 8888,
		xp: 999,
	},
	rules: {
		canKill:true,
		allowArmy:false,
		allowHelpers:true,
		minRankToGetKey: 4,
	},
	helpers:[],
},
};