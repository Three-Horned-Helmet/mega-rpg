const { armyTowerFight } = require("./army-tower/army-tower");
const towerInfoEmbed = require("./embeds/tower-results-embed");

// Takes an array of users
const towerHandler = async (user, args) => {
	let allResults;
	if(args[0] === "solo") {
		if(args[1] === "full-army") {
			allResults = await armyTowerFight([user], "solo");
		}
		else if (args[1] === "hero") {
			// Coming soon
		}
	}
	if(allResults) {
		const { embedTowerInfo } = towerInfoEmbed(allResults);
		return embedTowerInfo;
	}
	else {return "Something went wrong, most likely the command you typed were incorrect";}
};

module.exports = { towerHandler };