const { gainHeroExp } = require("../game/_CONSTS/hero-exp");

module.exports = {
	name: "test",
	description: "Only for testing purposes.",
	async execute(message, args, user) {
		await gainHeroExp(user, 200, message);
		message.channel.send("IT WORKED");
	},
};