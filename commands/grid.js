const createGridCanvas = require("../game/grid/create-grid-canvas");

module.exports = {
	name: "grid",
	aliases: ["empire"],
	description: "Displays the building grid and all the buildings you have currently built in your empire.",
	async execute(message, args, user) {
		const gridImage = await createGridCanvas(user);
		await user.save();
		return message.channel.send(`<@${message.author.id}>'s Empire (${user.empire.length}/${user.maxBuildings}):`, gridImage);
	},
};