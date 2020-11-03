module.exports = { "C'Thun": {
	name: "C'Thun",
	type: "miniboss",
	stats:{
		attack: 110,
		health: 200,
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
		gold: 500,
		xp: 500,
	},
}, };