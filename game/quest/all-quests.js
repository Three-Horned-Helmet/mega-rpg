const gettingStarted = require("./quests/getting-started");

// Buildings
const footprintsInTheDark = require("./quests/building-quests/footprints-in-the-dark");

// Grassy Plains
const childSupport = require("./quests/grassy-plains/child-support");
const missingDaughter = require("./quests/grassy-plains/missing-daughter");
const refugeesInTheForest = require("./quests/grassy-plains/refugees-in-the-forest");
const mysteryMine = require("./quests/grassy-plains/mystery-mine");
const foolsTreasureHunt = require("./quests/grassy-plains/fools-treasure-hunt");

const allQuests = {
    gettingStarted,
    "Building Quests": { ...footprintsInTheDark },
    "Grassy Plains": { ...childSupport, ...missingDaughter, ...refugeesInTheForest, ...mysteryMine, ...foolsTreasureHunt },
};

module.exports = allQuests;