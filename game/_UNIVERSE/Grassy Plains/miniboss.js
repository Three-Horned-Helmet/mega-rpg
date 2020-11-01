module.exports = { "C'Thun": {
	name: "C'Thun",
	type: "miniboss",
	stats:{
		attack: 90,
		health: 100,
	},
	combatRules:{
		maxRounds: 2,
		armyAllowed: false,
		helpersAllowed: true,
	},
	allowedNumOfAttacks: 2,
	weapons: ["slash", "strike", "poke"],
	minRankToGetKey: 2,
	rewards:{
		dungeonKey: "CM Key",
		gold: 120,
		xp: 500,
	},
}, };