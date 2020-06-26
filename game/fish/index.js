const { onCooldown } = require("../_CONSTS/cooldowns");
const { worldLocations } = require("../_CONSTS/explore");
const { getLocationIcon, getPlaceIcon } = require("../_CONSTS/icons");
const { calculateFishResult } = require("./fishvalue");

const handleFish = async (user) => {
    const { currentLocation } = user.world;
    const onCooldownInfo = onCooldown("fish", user);

    if (onCooldownInfo.response) {
        return onCooldownInfo.embed;
    }

    const fishingPlaceInformation = Object.values(worldLocations[currentLocation].places).find(p=>{
        return p.type === "fish";
    });
    const locationIcon = getLocationIcon(currentLocation);
    const placeIcon = getPlaceIcon("fish");
    if (!user.world.locations[currentLocation].explored.includes([fishingPlaceInformation.name])) {
        return `You haven't found any place to ${placeIcon} fish in ${locationIcon} ${currentLocation}`;
    }

    const now = new Date();

    const { fish } = fishingPlaceInformation;

    const result = calculateFishResult(fish);

    user.handleFishResult(result.gold, now);
    await user.save();

    return result.response;
};


module.exports = { handleFish };
