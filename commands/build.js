const buildingsObject = require("../game/build/buildings-object");
const constructBuilding = require("../game/build/construct-building");
const User = require("../models/User");

module.exports = {
	name: "build",
	description: "Build a structure.",
	execute(message, args) {
		const building = buildingsObject[args[0]];
		const coordinates = args[1].split(".").map(el => parseInt(el));
		console.log(building, coordinates);

		if(!building) {
			message.channel.send(`${args[0]} is an unknown building command`);
			return;
		}

		if(coordinates.find(el => el > 9 || el < 0) || coordinates.length !== 1) {
			message.channel.send("Please enter two coordinates from 0-9 in this format divided by a punctuation. e.g. !build barracks 1.1 ");
			return;
		}


		// Find user in the database here


		const canBeBuilt = constructBuilding.checkIfBuildIsPossible(
			{ empire: [
				{ name: "barracks", position: [1, 1], level: 1 },
			],
			resources: {
				gold: 20,
				oak: 30,
			} },
			building, coordinates,
		);

		if(!canBeBuilt.response) {
			message.channel.send(canBeBuilt.message);
			return;
		}
		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
	},
};