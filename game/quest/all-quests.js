const gettingStarted = require("./quests/getting-started");
const missingDaughter = require("./quests/grassy-plains/missing-daughter");
const mysteryMine = require("./quests/grassy-plains/mystery-mine");
const foolsTreasureHunt = require("./quests/grassy-plains/fools-treasure-hunt");
const footprintsInTheDark = require("./quests/building-quests/footprints-in-the-dark");

const allQuests = {
    gettingStarted,
    "Building Quests": { ...footprintsInTheDark },
    ["Grassy Plains"]: { ...missingDaughter, ...mysteryMine, ...foolsTreasureHunt },
};

module.exports = allQuests;