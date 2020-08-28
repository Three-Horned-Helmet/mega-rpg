const templar = {
	stats: {
		health: 1.2,
		attack: 0.9,
		threat: 1.2,
	},
	spells: {
		holyStrike: {
			name: "Holy Strike",
			chanceForSuccess: 0.8,
			cast: (player, target, progress) => {

			},
			description: "Hits the enemy wth holy power!"
		},
		shieldWall: {
			name: "Shield Wall",
			chanceForSuccess: 1,
			cast: async (player, target, progress) => {

			},
			description: "Brings up your shield to decrease damage recieved for 1 turn"
		},
		taunt: {
			name: "Taunt",
			chanceForSuccess: 1,
			cast: async (player, target, progress) => {

			},
			description: "Taunts the enemies, increasing the chance that an enemy attacks you for 2 turns"
		}
	}
};

module.exports = { templar };