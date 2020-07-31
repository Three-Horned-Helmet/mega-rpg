const dungeon = require("./dungeon");
const fish = require("./fish");
const hunt = require("./hunt");
const miniboss = require("./miniboss");
const questPlaces = require("./questPlaces");
const raid = require("./raid");

const grassyPlains = {
	description: "Here you can find all the noobs, such as yourself",
	places:{ ...dungeon, ...fish, ...hunt, ...miniboss, ...questPlaces, ...raid }
};

module.exports = { grassyPlains };