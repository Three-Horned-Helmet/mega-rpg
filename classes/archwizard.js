const archwizard = {
	stats: {
		health: 0.8,
		attack: 1.2,
		threat: 0.8,
	},
	spells: {
		fireball: {
			name: "Fireball",
			chanceForSuccess: 1,
			cast: (player, target, progress) => {

			},
			description: "Casts a ball of fire at the enemy"
		},
		frostArmor: {
			name: "Frost Armor",
			chanceForSuccess: 1,
			cast: async (player, target, progress) => {

			},
			description: "Casts frost armor at a target, decrease damage taken for 3 turns"
		},
		rainOfFire: {
			name: "Rain of Fire",
			chanceForSuccess: 1,
			cast: async (player, target, progress) => {

			},
			description: "Conjures a rain of fire that deals damage to all enemies for 2 turns"
		}
	}
};

module.exports = { archwizard };