const { onCooldown } = require("../_CONSTS/cooldowns");

const handleFish = async (user) => {
    const { explored } = user.world.locations["Grassy Plains"];
    const { currentLocation } = user.world;
    const onCooldownInfo = onCooldown("fish", user);

    const now = new Date();
    if (onCooldownInfo.response) {
        return onCooldownInfo.embed;
    }
    if (!explored.includes("River")) {
        return `You have not explored any rivers yet in ${currentLocation}`;
    }


    const randomNumber = Math.random();
    const chance = 0.5;

    let goldResult = 0;
    const fish = ["Cod", "Trout", "Swordfish"];
    let fishResult = "";
    
    let result = ""

    if (randomNumber > chance) {
        // 'Swordfish'
        fishResult = fish[Math.floor(Math.random() * fish.length)];
        // 0,1,2
        const multiplier = fish.indexOf(fishResult);
        // 0-50
        goldResult = Math.floor(multiplier * 20 + (Math.random() * 10));

        result = `you caught a ${fishResult} and sold it for ${goldResult} gold`;
    } else {
    result = generateFailFishSentence()
    }
    user.handleFishResult(goldResult, now);

    return result
};

const generateFailFishSentence = () => {
    const sentences = [
        "You fished for hours with no luck",
        "You lost your bait while fishing",
        "You caught an old boot",
        "You put your fishing rod down and took a swim instead"];
    return sentences[Math.floor(Math.random() * sentences.length)];
};

module.exports = { handleFish };
