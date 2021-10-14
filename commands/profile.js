const { prettifyUser } = require("../game/profile");
const { getPlayerPosition } = require("../game/profile/helper");
const User = require("../models/User");

module.exports = {
	name: "profile",
	aliases: ["p"],
	description: "Display info about a user.",
	async execute(message, args, user) {
		if (message.guild === null) {

			let dbUser;
			let avatar;

			avatar = message.author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 });

			if (!dbUser) {
				dbUser = user;
				avatar = message.author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 });
			}
			const expPosition = await getPlayerPosition(dbUser.account.userId);
			const prettifiedUser = prettifyUser(expPosition, dbUser, avatar);
			message.channel.send(prettifiedUser);


		}
		else {
			let dbUser;
			let avatar;


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
				avatar = message.author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 });
			}
			const expPosition = await getPlayerPosition(dbUser.account.userId);
			const prettifiedUser = prettifyUser(expPosition, dbUser, avatar);
			message.channel.send(prettifiedUser);
		}
	},
};