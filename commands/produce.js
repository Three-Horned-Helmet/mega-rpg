const changeProducedResource = require("../game/produce/change-produced-resource");

module.exports = {
	name: "produce",
	description: "Changes the produced resources from mine and lumbermill.",
	execute(message, args, user) {
		const resource = args.join(" ");

		changeProducedResource(user, resource).then((response) => {
			message.channel.send(`<@${message.author.id}>: ${response}`);
		});
	},
};