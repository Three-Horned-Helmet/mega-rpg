const createGridCanvas = require("../game/grid/create-grid-canvas");

module.exports = {
	name: "grid",
	description: "Displays the building grid and all the buildings.",
	async execute(message, args, user) {
		const gridImage = await createGridCanvas(user);

		message.channel.send("Your city", gridImage);
	},
};