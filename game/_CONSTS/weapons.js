const weaponInformation = {
	"slash": {
		name: "slash",
		type: "attack",
		chanceforSuccess: 0.95,
		damage: 1,
		description: "\n95% chance of slashing the enemy",
	},
	"strike": {
		name: "strike",
		type: "attack",
		chanceforSuccess: 0.80,
		damage: 2,
		description: "\n80% chance of causing a strong attack",
	},
	"critical": {
		name: "critical",
		type: "attack",
		chanceforSuccess: 0.40,
		damage: 4,
		description: "\n40% chance of causing a brutal attack",
	},
	"heal": {
		name: "heal",
		type: "heal",
		chanceforSuccess: 0.90,
		damage: 0.25,
		description: "\n90% chance of healing a teammate",
	},
	"poke": {
		name: "poke",
		type: "attack",
		chanceforSuccess: 0.1,
		damage: 0.05,
		description: "\n10% chance of poking the enemy",
	},
};

module.exports = { weaponInformation };