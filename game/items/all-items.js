const blacksmithItems = require("./blacksmith/blacksmith-items");
const artifactBlacksmithItems = require("./artifact-blacksmith/artifact-blacksmith");
const forgeItems = require("./forge/forge-items");

module.exports = { ...blacksmithItems, ...forgeItems, ...artifactBlacksmithItems };