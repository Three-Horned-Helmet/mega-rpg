const { onCooldown } = require("../_CONSTS/cooldowns");
const { worldLocations } = require("../_CONSTS/explore");
const { getLocationIcon } = require("../_CONSTS/icons");
const { pveFullArmy } = require("../../combat/combat");
const { generateEmbedPveFullArmy } = require("../../combat/pveEmedGenerator");

const handleRaid = async (user, place = null) => {

    // checks for cooldown
    const cooldownInfo = onCooldown("raid", user);
    if (cooldownInfo.response) {
        return cooldownInfo.embed;
    }

    const { currentLocation } = user.world;
    const placesInCurrentWorld = worldLocations[currentLocation].places;
    const locationIcon = getLocationIcon(currentLocation);

    const userExploredPlaces = user.world.locations[currentLocation].explored;
    const userExploredRaidPlaces = userExploredPlaces
    .filter(p=>{
        return placesInCurrentWorld[p].type === "raid";
    })
    .map(p=>{
        return p.replace(/\s/g, "").toLowerCase();
    });

    // checks if user has explored any raidable place in current location
    if (!userExploredRaidPlaces.length) {
        return `You have not explored any place to raid in ${locationIcon} ${currentLocation}, try \`!explore\` to find a place to raid`;
    }


     const userExploredNotRaidPlaces = userExploredPlaces
     .filter(p=>{
        return placesInCurrentWorld[p].type !== "raid";
    })
     .map(p=>{
        return p.replace(/\s/g, "").toLowerCase();
    });

    // if user tries to raid a place that is not raidable
    if (userExploredNotRaidPlaces.includes(place)) {
        return "This place cannot be raided";
    }

    let placeInfo;

    // if user wants to raid a specific place
    if (place) {
        placeInfo = Object.values(placesInCurrentWorld).find(p=>{
        const friendlyFormat = p.name.replace(/\s/g, "").toLowerCase();
        return friendlyFormat === place;

        // if we want to make it user friendly
        // and let the user type in the first 4 letters of the place
        // but then we can't 4 places starting with 'bandit'
        // friendlyFormat.slice(0, 4) === place.slice(0, 4)
    });
}
 else {
     // if user doesn't provide a specific place to raid, the user will be given a random place

    const listOfPlaces = Object.values(placesInCurrentWorld).filter(p=>{
        const friendlyFormat = p.name.replace(/\s/g, "").toLowerCase();
        return userExploredRaidPlaces.includes(friendlyFormat);
    });
    placeInfo = listOfPlaces[Math.floor(Math.random() * listOfPlaces.length)];

 }

 // if user tries to raid that doesn't exist
 if (!placeInfo) {
     if (place.length > 10) {
         place = `${place.slice(0, 10)}[...]`;
     }
    return `${place} does not exist in ${locationIcon} ${currentLocation}. Use !look to see your surroundings`;
}

    // calculates result
 const raidResult = await pveFullArmy(user, placeInfo);
 // saves to database
 await user.handlePveFullArmy(raidResult);
 // generates an mbed
 const raidEmbed = generateEmbedPveFullArmy(user, placeInfo, raidResult);


 return raidResult;

};

module.exports = { handleRaid };