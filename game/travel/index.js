const { worldLocations } = require("../_UNIVERSE");
const { getIcon } = require("../_CONSTS/icons");
const handleTravel = async (user, travelDestination) => {
	const { currentLocation } = user.world;

	const playerUnlockedLocations = Object.keys(user.world.locations)
		.filter(location => user.world.locations[location].available);

	// Player has not unlocked other locations than started location
	if (playerUnlockedLocations.length <= 1) {
		return `You haven't unlocked anything but ${getIcon(currentLocation)} ${currentLocation}`;
	}

	// Find location from shortcut if shortcut is used
	const newLocation = playerUnlockedLocations
		.filter(location => {
			return worldLocations[location].shortcuts.includes(travelDestination) || travelDestination === location.toLowerCase();
		})
		.map(location => location)[0];

	if (!newLocation) return "You can't travel there. Try `!look` to see your available locations - if any..";
	if (newLocation === currentLocation) return "You're already there!";

	const { description } = worldLocations[newLocation];
	user.travelToLocation(newLocation);
	await user.save();
	return `You traveled to ${getIcon(newLocation)} ${newLocation}\n${description}`;


};


module.exports = { handleTravel };