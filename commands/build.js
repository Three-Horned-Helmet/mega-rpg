const buildingsObject = require("../game/build/buildings-object");
const constructBuilding = require("../game/build/construct-building");

module.exports = {
	name: "build",
	description: "Build a structure.",
	execute(message, args, user) {
		if (args.length === 0) return message.channel.send("You need an argument");
		const building = buildingsObject[args.slice(0, args.length - 1).join(" ")];
		const coordinates = args[args.length - 1].split(".").map(cord => parseInt(cord));

		// Build function
		constructBuilding(
			user,
			building, coordinates,
		).then((response) => {
			message.channel.send(`<@${message.author.id}>: ${response}`);
		});

		// Add !build help command to see the structures you can build
	},
};