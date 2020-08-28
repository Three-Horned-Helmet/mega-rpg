const shaman = {
	stats: {
		health: 1.1,
		attack: 1,
		threat: 0.9,
	},
	spells: {
		naturesHealing: {
			name: "Nature's Healing",
			chanceForSuccess: 0.8,
			cast: (player, target, progress) => {

			},
			description: "Casts a healing stream of pure nature"
		},
		chainLightning: {
			name: "Chain Lightning",
			chanceForSuccess: 1,
			cast: async (player, target, progress) => {

			},
			description: "Casts a chain of lightning hitting several targets"
		},
		protectiveTotem: {
			name: "Protective Totem",
			chanceForSuccess: 1,
			cast: async (player, target, progress) => {

			},
			description: "Sets down a totem that protects your team for 2 rounds"
		}
	}
};

module.exports = { shaman };