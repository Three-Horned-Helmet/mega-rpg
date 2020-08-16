const User = require("../models/User");

const welcomeMessage = (user) => {
	return `Welcome to Mega-RPG, ${user.account.username}!\n\nWe highly recommend you to get into the game by completing the tutorial quest line. You can start it by typing \`!quest\` in the chat. To see all available commands you can type \`!help\` or to get a more detailed version of what the commands do type \`!info\`!\n\nGood luck adventruer, and if you have any feedback it is much appreciated!`;
};

const createNewUser = (user, channelId) => {
	if (user.bot) {
		console.error("No bots allowed");
		return;
	}
	const account = {
		username: user.username,
		userId: user.id,
		servers:[channelId]
	};
	const newUser = new User({
		account,
	});
	return newUser.save();
};

module.exports = { welcomeMessage, createNewUser };