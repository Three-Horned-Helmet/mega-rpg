const { towerHandler } = require("../game/tower/tower");
const towerInfoEmbed = require("../game/tower/tower-info-embed");

// const { getNewTowerItem, getTowerItemStats } = require("../game/items/tower-items/tower-item-functions");

module.exports = {
	name: "tower",
	description: "Tower will be unlocked in later stages of the game. It is a place where you can fight an infinite amount of enemies and dropping gear that scales with the level you managed to get in the tower.",
	shortcuts: {
		sfa: "solo full-army"
	},
	execute(message, args, user) {
		// const newItem = getNewTowerItem(5);
		// getTowerItemStats(newItem);
		// return;

		if(args.length === 0) return message.channel.send(towerInfoEmbed(user));

		towerHandler(user, args).then(response => {
			message.channel.send(`<@${message.author.id}>: ${response}`);
		});
	},
};