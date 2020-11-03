module.exports = { "Kraken": {
	name: "Kraken",
	type: "miniboss",
	stats:{
		attack: 1800,
		health: 1800,
	},
	combatRules: {
		maxRounds: 3,
		armyAllowed:false,
		helpersAllowed:true,
	},
	allowedNumOfAttacks: 3,
	weapons: ["slash", "strike", "critical"],
	minRankToGetKey: 22,
	rewards:{
		dungeonKey: "The One Shell",
		gold: 8888,
		xp: 9999,
	},
}, };