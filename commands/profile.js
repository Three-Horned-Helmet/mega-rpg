const { prettifyUser } = require("../game/profile");
const User = require("../models/User");

module.exports = {
	name: "profile",
	aliases: ["p"],
	description: "Display info about a user.",
	async execute(message, args, user) {
		let dbUser;
		let avatar;
		// this will fail if sent as a DM
		const userFromMention = message.mentions.members.first();
		if (userFromMention) {
			avatar = userFromMention.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 });
			try {
				// retrieves the user mentioned in as argument eg: !profile @Ignore
				dbUser = await User.findOne({ "account.userId": userFromMention.user.id });
			}
			catch (err) {
				console.error("error: ", err);
			}
		}
 else {
			avatar = message.author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 });
		}
		if (!dbUser) {
			dbUser = user;
		}
		const prettifiedUser = await prettifyUser(message, dbUser, avatar);
		message.channel.send(prettifiedUser);
	},
};
