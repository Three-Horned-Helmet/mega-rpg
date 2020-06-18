const { handleDungeon } = require("../game/dungeon");

module.exports = {
	name: "dungeon",
	description: "Let's the player trigger a dungeon",
	async execute(message, args, user) {
		await handleDungeon(message, user);
		},
	};