const { worldLocations } = require("../_CONSTS/explore");
const { getLocationIcon } = require("../_CONSTS/icons");
const handleTravel = async (user, travelDestination) => {
    const { currentLocation } = user.world;

    const playerUnlockedLocations = Object.keys(user.world.locations)
        .filter(location=> user.world.locations[location].available)
        .map(location=> location.split(" ").join("").toLowerCase("").substring(0, 4));

    if (playerUnlockedLocations.length < 2) {
        return `You haven't unlocked anything but ${getLocationIcon(currentLocation)} ${currentLocation}`;
    }
    const shortAnswer = travelDestination.substring(0, 4);
    // allows the player to not type out the ful name
    if (playerUnlockedLocations.includes(shortAnswer)) {
        const newDestination = Object.keys(worldLocations).filter(location=>{
            return location.split(" ").join("").toLowerCase("").substring(0, 4) === shortAnswer;
        });
        const worldDescription = worldLocations[newDestination[0]].description;
        await user.locationTravel(newDestination[0]);
        return `You traveled to ${getLocationIcon(newDestination)} ${newDestination[0]}\n${worldDescription}`;
    }

    return "You can't travel there. Try ` !look ` to see your available locations - if any..";
};


module.exports = { handleTravel };