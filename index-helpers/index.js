const User = require("../models/User");

const welcomeMessage = (user) => {
	return `Welcome to Mega-RPG, ${user.account.username}!\n\nIt's recommended to start by completing the tutorial quest line.\nYou can start it by typing \`!quest\` in the chat. To see all available commands you can type \`!help\` or to get a more detailed version of what the commands do type \`!info\`!\n\nGood luck adventruer!`;
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