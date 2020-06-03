const { prettifyUser } = require("../game/profile");
const User = require("../models/User");

module.exports = {
  name: "profile",
  aliases: ["p"],
  description: "Display info about a user.",
  async execute(message, args, user) {
    let dbUser;
    let userIdFromArgs = null
    if (args.length) {
      userIdFromArgs = args[0].match(/\d+/)
    }
    if (userIdFromArgs) {
      try {
        dbUser = await User.findOne({ "account.userId": userIdFromArgs[0] }); // retrieves the user mentioned in as argument eg: !profile @Ignore
      }
      catch (err) {
        console.error('error: ', err)
      }
    }

    if (!dbUser) {
      dbUser = user;
    }

    const prettifiedUser = prettifyUser(message, dbUser);
    message.channel.send(prettifiedUser);
  },
};
