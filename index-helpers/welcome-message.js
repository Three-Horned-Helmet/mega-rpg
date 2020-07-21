const welcomeMessage = (user) => {
	return `Welcome to Mega-RPG, ${user.account.username}!\n\nWe highly recommend you to get into the game by completing the tutorial quest line. You can start it by typing \`!quest\` in the chat. To see all available commands you can type \`!help\` or to get a more detailed version of what the commands do type \`!info\`!\n\nGood luck andventruer, and if you have any feedback it is much appreciated!`;
};

module.exports = { welcomeMessage };