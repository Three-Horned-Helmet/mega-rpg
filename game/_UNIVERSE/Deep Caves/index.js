const dungeon = require("./dungeon");
const fish = require("./fish");
const hunt = require("./hunt");
const miniboss = require("./miniboss");
const questPlaces = require("./questPlaces");
const raid = require("./raid");

const deepCaves = {
	description: "Wecome to the deep caves. You won't make it out of here alive.",
	shortcuts: ["caves", "deep", "cave"],
	places:{ ...dungeon, ...fish, ...hunt, ...miniboss, ...questPlaces, ...raid }
};

module.exports = { deepCaves };

