const hunter = {
	stats: {
		health: 1,
		attack: 1.1,
		threat: 1,
	},
	spells: {
		precisionShot: {
			name: "Precision Shot",
			chanceForSuccess: 1,
			cast: (player, target, progress) => {

			},
			description: "Aims with high precision at the target"
		},
		callOfTheBeast: {
			name: "Call of the Beast",
			chanceForSuccess: 1,
			cast: async (player, target, progress) => {

			},
			description: "Calls for aim from nearby beasts"
		},
		poisonedArrow: {
			name: "Poisoned Arrow",
			chanceForSuccess: 1,
			cast: async (player, target, progress) => {

			},
			description: "Shoots a poisoned arrow the weakens the strength of the target for 2 turns"
		}
	}
};

module.exports = { hunter };