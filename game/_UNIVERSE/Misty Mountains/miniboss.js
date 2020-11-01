module.exports = { "Graveward": {
	name: "Graveward",
	type: "miniboss",
	stats:{
		attack: 600,
		health: 600,
		difficulty: 35,
	},
	rewards:{
		dungeonKey: "Eridian Vase",
		gold: 8888,
		xp: 999,
	},
	rules: {
		maxRounds: 2,
		canKill:true,
		allowArmy:false,
		allowHelpers:true,
		minRankToGetKey: 12,
	},
}, };