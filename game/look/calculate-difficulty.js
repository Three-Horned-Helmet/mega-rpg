const { worldLocations } = require("../_UNIVERSE");

// returns the highest and lowest strength of the units in a specific Location (like Grassy Plains)
const calculateTopAndLowStrengths = (location) => {
	const result = {};

	["raid", "hunt"].forEach((type) => {
		let highestStrength;
		let lowestStrength;
		Object.values(worldLocations[location].places)
			.filter(place => place.type === type)
			.forEach(loc => {
				if (!loc.stats) return;

				const strength = Object.values(loc.stats).reduce((a, b) => a + b);

				if (!highestStrength || strength > highestStrength) highestStrength = strength;
				if (!lowestStrength || strength < lowestStrength) lowestStrength = strength;
			});

		result[type] = { lowestStrength, highestStrength };
	});

	return result;
};

module.exports = { calculateTopAndLowStrengths };