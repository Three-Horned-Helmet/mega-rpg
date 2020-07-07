const { handleMiniboss } = require("../game/miniboss");

module.exports = {
	name: "miniboss",
	description: "Let's the player trigger a miniboss",
	async execute(message, args, user) {
		await handleMiniboss(message, user);
	},
};