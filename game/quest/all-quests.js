const gettingStarted = require("./quests/getting-started");
const grassyPlains = require("./quests/grassy-plains");

const allQuests = {
    gettingStarted,
    ["Grassy Plains"]: grassyPlains,
};

module.exports = allQuests;