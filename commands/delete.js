const User = require("../models/User");

module.exports = {
	name: "deleteme",
	description: "developer command, kills yourself",
	execute(message) {
		User.deleteOne({ "account.userId": message.author.id })
			.then(result => {
				message.channel.send(`${message.author.username} deleted -- deleteCount: ${result.deletedCount} `);
			}).catch(e =>{
				console.error("error: ", e);
				message.channel.send("Could not delete");
			});
	},
};

