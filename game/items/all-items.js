const blacksmithItems = require("./blacksmith/blacksmith-items");
const artifactBlacksmithItems = require("./artifact-blacksmith/artifact-blacksmith");
const forgeItems = require("./forge/forge-items");
const questItems = require("./quest-items/quest-items");
const heroTowerItems = require("./tower-items/tower-items");

module.exports = { ...forgeItems, ...blacksmithItems, ...artifactBlacksmithItems, ...questItems, ...heroTowerItems };