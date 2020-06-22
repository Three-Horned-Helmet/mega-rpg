const gettingStarted = require("./quests/getting-started");
const grassyPlains = require("./quests/grassy-plains");
const footprintsInTheDark = require("./quests/building-quests/footprints-in-the-dark");

const allQuests = {
    gettingStarted,
    "Building Quests": { ...footprintsInTheDark },
    ["Grassy Plains"]: grassyPlains,
};

module.exports = allQuests;