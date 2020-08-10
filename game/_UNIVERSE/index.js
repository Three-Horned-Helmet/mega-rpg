const { grassyPlains } = require("./Grassy Plains");
const { deepCaves } = require("./Deep Caves");
const { mistyMountains } = require("./Misty Mountains");

const worldLocations = {
	"Grassy Plains": grassyPlains,
	"Misty Mountains":mistyMountains,
	"Deep Caves": deepCaves,
};

module.exports = { worldLocations };