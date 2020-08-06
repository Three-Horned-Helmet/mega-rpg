const changeProducedResource = require("../game/produce/change-produced-resource");
const showProduceEmbed = require("../game/produce/display-available-produce");

module.exports = {
	name: "produce",
	description: "Changes the produced resources from mine and lumbermill. Make sure you have a mine or a lumbermill level 1 to change production.",
	shortcuts: {
		copper: "copper ore",
		iron: "iron ore",
		mithril: "mithril ore",
		burite: "burite ore",
		oak: "oak wood",
		yew: "yew wood",
		barlind: "barlind wood",
		aspen: "aspen wood"
	},
	execute(message, args, user) {
		if(args.length === 0) return message.channel.send(showProduceEmbed(user));

		// Filter to remove duplicates arising from the shortcuts
		const resource = args.filter((el, i) => args.indexOf(el) === i).join(" ");

		changeProducedResource(user, resource).then((response) => {
			message.channel.send(`<@${message.author.id}>: ${response}`);
		});
	},
};