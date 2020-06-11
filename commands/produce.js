const changeProducedResource = require("../game/produce/change-produced-resource");
const showProduceEmbed = require("../game/produce/display-available-produce");

module.exports = {
	name: "produce",
	description: "Changes the produced resources from mine and lumbermill.",
	execute(message, args, user) {
		if(args.length === 0) return message.channel.send(showProduceEmbed(user));

		const resource = args.join(" ");

		changeProducedResource(user, resource).then((response) => {
			message.channel.send(`<@${message.author.id}>: ${response}`);
		});
	},
};