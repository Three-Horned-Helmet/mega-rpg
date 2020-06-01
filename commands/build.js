const buildingsObject = require("../game/build/buildings-object");
const constructBuilding = require("../game/build/construct-building");

module.exports = {
	name: "build",
	description: "Build a structure.",
	execute(message, args, user) {
		const building = buildingsObject[args[0]];
		const coordinates = args[1].split(".").map(el => parseInt(el));
		console.log(building, coordinates);

		const canBeBuilt = constructBuilding.checkIfBuildIsPossible(
			user,
			building, coordinates,
		);

		if(!canBeBuilt.response) {
			message.channel.send(canBeBuilt.message);
			return;
		}

		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
	},
};