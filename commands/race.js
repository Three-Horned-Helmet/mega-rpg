const { handleRace } = require("../game/race");

module.exports = {
	name: "race",
	description: "Triggers a race where players can win money",
	async execute(message, args, user) {
		await handleRace(message, user);

	},
};

