const Discord = require("discord.js");

const { worldLocations } = require("../_UNIVERSE");
const { getIcon } = require("../_CONSTS/icons");

const { calculateTopAndLowStrengths } = require("./calculate-difficulty");

const getWorld = async (user) => {

	const { currentLocation } = user.world;
	const currentLocationWithIcon = `${getIcon(currentLocation)} ${currentLocation}`;

	const exploreCommand = "```!explore```";
	const defaultNonExplored = `You have not explored anything in ${currentLocation}\ntry: ${exploreCommand}`;

	const exploredPlaces = user.world.locations[currentLocation].explored;
	const strengths = calculateTopAndLowStrengths(currentLocation);
	const exploredPlacesWithIcons = exploredPlaces.length ? exploredPlaces.map(place => {
		const { type, stats } = worldLocations[currentLocation].places[place];
		let difficulty = "";
		if (strengths[type]) {
			const { lowestStrength, highestStrength } = strengths[type];
			difficulty = stats ? Math.floor(((Object.values(stats).reduce((a, b) => a + b) - lowestStrength) / (highestStrength - lowestStrength)) * 9 + 1) : "";
		}

		return `${getIcon(type)} ${place} ${typeof difficulty === "number" ? getIcon("difficulty").repeat(difficulty) : difficulty}`;
	}) : defaultNonExplored;

	const sideColor = "#45b6fe";
	const username = `${user.account.username}`;
	const legend = new Set();

	Object.keys(worldLocations[currentLocation].places).map(p => {
		const { type } = worldLocations[currentLocation].places[p];
		legend.add(`${getIcon(type, "icon")} \`!${type}\` ~ `);
	});
	const legendCollection = Array.from(legend).join("");
	const fields = [
		{
			name: "Current location:",
			value: currentLocationWithIcon,
			inline: false,
		},
		{ name: "\u200B", value: "\u200B" },
		{
			name: `Explored Places in ${currentLocation}:`,
			value: exploredPlacesWithIcons,
			inline: false,
		},
		{
			name: "Legend",
			value: legendCollection
		}
	];

	const availableLocations = Object.keys(user.world.locations)
		.filter(l => user.world.locations[l].available === true && l !== currentLocation)
		.map(l => `${getIcon(l)} ${l}`);

	if (availableLocations.length) {
		fields.splice(1, 0, {
			name: "Available locations",
			value: availableLocations,
			inline: false,
		});
	}

	const embedLook = new Discord.MessageEmbed()
		.setTitle(`${username}'s world`)
		.setColor(sideColor)
		.addFields(
			...fields,
		);
	await user.save();
	return embedLook;
};

module.exports = { getWorld };

