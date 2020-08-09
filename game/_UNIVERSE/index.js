const { grassyPlains } = require("./Grassy Plains");
const { deepCaves } = require("./Deep Caves");
const { mistyMountains } = require("./Misty Mountains");

const worldLocations = {
	"Grassy Plains": grassyPlains,
	"Deep Caves": deepCaves,
	"Misty Mountains":mistyMountains
};

module.exports = { worldLocations };