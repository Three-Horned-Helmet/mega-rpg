const { armyTowerFight } = require("./army-tower/army-tower");

// Takes an array of users
const towerHandler = async (user, args) => {
	if(args[0] === "solo") {
		if(args[1] === "full-army") {
			armyTowerFight([user], "solo");
		}
		else if (args[1] === "hero") {
		}
	}
};

module.exports = { towerHandler };