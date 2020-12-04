const { onCooldown } = require("../_CONSTS/cooldowns");
const { worldLocations } = require("../_UNIVERSE");
const { getIcon } = require("../_CONSTS/icons");
const { calculateFishResult } = require("./helper");

const handleFish = async (user) => {
	const { currentLocation } = user.world;
	const onCooldownInfo = onCooldown("fish", user);

	if (onCooldownInfo.response) {
		return onCooldownInfo.embed;
	}

	const fishingPlaceInformation = Object.values(worldLocations[currentLocation].places).find(p => {
		return p.type === "fish";
	});
	const locationIcon = getIcon(currentLocation);
	const placeIcon = getIcon("fish");
	if (!user.world.locations[currentLocation].explored.includes([fishingPlaceInformation.name])) {
		return `You haven't found any place to ${placeIcon} fish in ${locationIcon} ${currentLocation}`;
	}

	const { fish } = fishingPlaceInformation;

	const result = calculateFishResult(fish);

	const now = new Date();
	user.setNewCooldown("fish", now);
	user.gainManyResources({ gold: result.gold });
	await user.save();

	return result.response;
};


module.exports = { handleFish };
