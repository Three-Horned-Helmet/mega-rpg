const buildingsObject = require("../game/build/buildings-object");
const constructBuilding = require("../game/build/construct-building");
const availableBuilds = require("../game/build/show-available-builds");

module.exports = {
	name: "build",
	description:
    "Build or upgrade structures used for creating an army. Try: `!build mine` followed by `!grid` to get started.",
	usage: "!build mine 0.1",
	shortcuts: {
		ba: "barracks",
		ar: "archery",
		fa: "farm",
		mi: "mine",
		lu: "lumbermill",
		fo: "forge",
		bl: "blacksmith",
		arm: "armorer",
		se: "senate",
		sh: "shop",
		to: "tax office",
	},
	execute(message, args, user) {
		const building = Object.values(buildingsObject).find((b) =>
			args.includes(b.name) || args.join(" ").includes(b.name)
		);
		if (args.length === 0 || !building) return message.channel.send(availableBuilds(user));

		// Remove the user.empire.find stuff to make it possible to build several of the same building
		// || (building && user.empire.find(b => b.name === building.name))
		if (args.includes("-u") && building) {
			const gridCords = args.find((el) => el.match(/\d+\.\d+/g));
			const usersBuildings = user.empire
				.filter((b) =>
					gridCords
						? b.name === building.name &&
              b.position[0] === parseInt(gridCords.split(".")[0]) &&
              b.position[1] === parseInt(gridCords.split(".")[1])
						: b.name === building.name
				)
				.sort((a, b) => a.level - b.level);
			if (usersBuildings.length > 0) {
				args[args.length - 1] = usersBuildings[0].position.join(".");
			}
		}

		const coordinates = args[args.length - 1]
			.split(".")
			.map((cord) => parseInt(cord));

		// Build function
		constructBuilding(user, building, coordinates).then((response) => {
			message.channel.send(`<@${message.author.id}>: ${response}`);
		});

		// Add !build help command to see the structures you can build
	},
};
