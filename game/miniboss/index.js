/* const User = require("../../models/User"); */
const { onCooldown } = require("../_CONSTS/cooldowns");
const { worldLocations } = require("../_CONSTS/explore");
const { getLocationIcon } = require("../_CONSTS/icons");
/* const { calculatePveFullArmyResult } = require("../../combat/combat");
const { generateEmbedPveFullArmy } = require("../../combat/pveEmedGenerator"); */

const minibossStartAllowed = (user)=>{

    // checks for cooldown
    const cooldownInfo = onCooldown("miniboss", user);
    if (cooldownInfo.response) {
        return cooldownInfo.embed;
    }

    // checks for too low hp
    if (user.hero.currentHealth < user.hero.health * 0.05) {
        return `Your hero's health is too low (**${user.hero.currentHealth}**)`;
    }

    const { currentLocation } = user.world;
    const minibossInformation = Object.values(worldLocations[currentLocation].places).find(p=>{
        return p.type === "miniboss";
    });

    const locationIcon = getLocationIcon(currentLocation);

    if (!user.world.locations[currentLocation].explored.includes[minibossInformation.name]) {
        return `You haven't found any miniboss in ${locationIcon} ${currentLocation}`;
    }


    return null;
};


module.exports = { minibossStartAllowed };