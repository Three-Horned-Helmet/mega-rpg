const dungeon = require("./dungeon");
const fish = require("./fish");
const hunt = require("./hunt");
const miniboss = require("./miniboss");
const questPlaces = require("./questPlaces");
const raid = require("./raid");

const mistyMountains = {
	description: "You've entered a hostile environment where rewards are equally big as the threats!",
	shortcuts: ["mist", "misty", "mountains", "mountain"],
	places:{ ...dungeon, ...fish, ...hunt, ...miniboss, ...questPlaces, ...raid }
};

module.exports = { mistyMountains };