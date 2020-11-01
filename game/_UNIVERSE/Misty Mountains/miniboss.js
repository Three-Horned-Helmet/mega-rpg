module.exports = { "Graveward": {
	name: "Graveward",
	type: "miniboss",
	stats:{
		attack: 600,
		health: 600,
	},
	allowedNumOfAttacks: 2,
	weapons: ["slash", "strike"],
	rewards:{
		dungeonKey: "Eridian Vase",
		gold: 8888,
		xp: 999,
	},
	minRankToGetKey: 12,
	combatRules: {
		maxRounds: 3,
		armyAllowed: false,
		helpersAllowed: true,
	},
}, };