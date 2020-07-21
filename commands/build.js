const buildingsObject = require("../game/build/buildings-object");
const constructBuilding = require("../game/build/construct-building");
const availableBuilds = require("../game/build/show-available-builds");

module.exports = {
	name: "build",
	description: "Build or upgrade structures used for creating an army. Try: `!build mine` followed by `!grid` to get started.",
	shortcuts: {
		ba: "barracks",
		ar: "archery",
		fa: "farm",
		mi: "mine",
		lu: "lumbermill",
		fo: "forge",
		bl: "blacksmith",
		arm: "armorer",
		sh: "shop",
	},
	execute(message, args, user) {
		if (args.length === 0) return message.channel.send(availableBuilds(user));
		const building = buildingsObject[args.slice(0, args.length - 1).join(" ")] || buildingsObject[args.slice(0, args.length).join(" ")];

		if(args[args.length - 1] === "-u" || (building && user.empire.find(b => b.name === building.name))) {
			const usersBuildings = user.empire.filter(b => b.name === building.name).sort((a, b) => a.level - b.level);
			if(usersBuildings.length > 0) {
				args[args.length - 1] = usersBuildings[0].position.join(".");
			}
		}

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