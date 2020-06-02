const buildingsObject = require("../game/build/buildings-object");
const constructBuilding = require("../game/build/construct-building");

module.exports = {
	name: "build",
	description: "Build a structure.",
	execute(message, args, user) {
		const building = buildingsObject[args[0]];
		const coordinates = args[1].split(".").map(cord => parseInt(cord));

		// Build function
		constructBuilding(
			user,
			building, coordinates,
		).then((result) => {
			message.channel.send(result.message);
		});

		// Add !build help command to see the structures you can build
	},
};