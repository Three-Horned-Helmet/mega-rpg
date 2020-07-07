const fs = require("fs");

module.exports = {
	name: "info",
	description: "Gives an overview of the different commands and their functionalities (big chunk of text)",
	async execute(message) {
		const data = fs.readFileSync("info.txt", "utf8");
		for (let i = 0, j = 2000; i < data.length; i += 2000, j += 2000) {
			while (data.substring(i, i + 1) !== "Æ") {
				i -= 1;
			}
			while (data.substring(j, j + 1) !== "Æ") {
				j -= 1;
			}

			const toSend = data.substring(i + 1, Math.min(data.length, j));
			message.author.send(toSend);
		}
		message.reply("I've sent you a DM with more info about the game!");

	},
};