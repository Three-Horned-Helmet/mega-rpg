const fs = require("fs");

module.exports = {
	name: "info",
	description: "Gives an overview of the different commands and their functionalities (big chunk of text)",
	async execute(message) {
        const data = fs.readFileSync("info.txt", "utf8");
        for(let i = 0; i < data.length; i += 2000) {
            const toSend = data.substring(i, Math.min(data.length, i + 2000));
            message.author.send(toSend);
        }
		message.reply("I've sent you a DM with more info about the game!");

	},
};