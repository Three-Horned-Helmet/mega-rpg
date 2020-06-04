const blacksmithItems = require("./blacksmith/blacksmith-items");
const forgeItems = require("./forge/forge-items");

module.exports = { ...blacksmithItems, ...forgeItems };