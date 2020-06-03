const barracksUnits = require("./barracks/barracks-units");
const archeryUnits = require("./archery/archery-units");

module.exports = { ...barracksUnits, ...archeryUnits };