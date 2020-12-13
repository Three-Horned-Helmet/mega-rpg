const { towerHandler } = require("../game/tower/tower");
const towerInfoEmbed = require("../game/tower/embeds/tower-info-embed");
const { onCooldown } = require("../game/_CONSTS/cooldowns");


// const { getNewTowerItem, getTowerItem } = require("../game/items/tower-items/tower-item-functions");

module.exports = {
	name: "tower",
	description: "Tower will be unlocked in later stages of the game. It is a place where you can fight an infinite amount of enemies and dropping gear that scales with the level you managed to get in the tower. Try `!tower`, `!tower sfa` or `!rank sfa`.",
	shortcuts: {
		sfa: "solo full-army"
	},
	async execute(message, args, user) {
		// const newItem = getNewTowerItem(5);
		// getTowerItem(newItem);
		// return;

		if(args.length === 0) return message.channel.send(towerInfoEmbed(user));

		// Maybe make tower CD specifin in the future
		const onCooldownInfo = onCooldown("tower", user);
		if (onCooldownInfo.response) {
			return message.channel.send(onCooldownInfo.embed);
		}

		const result = await towerHandler(user, args, message);
		return message.channel.send(result);

	},
};