const { armyTowerFight } = require("./army-tower/army-tower");

// Takes an array of users
const towerHandler = async (user, args) => {
	let response;
	if(args[0] === "solo") {
		if(args[1] === "full-army") {
			response = await armyTowerFight([user], "solo");
		}
		else if (args[1] === "hero") {
		}
	}

	if(response) return response.message;
	else return "Something went wrong, most likely the command you typed were incorrect";
};

module.exports = { towerHandler };