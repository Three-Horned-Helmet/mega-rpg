const { prettifyUser } = require("../game/profile");
const User = require("./../models/User");

module.exports = {
  name: "profile",
  aliases: ["p"],
  description: "Display info about a user.",
  async execute(message, args, user) {


    let dbUser;
    if (args.length) {
      // if the user wants the profile of someone other than him or herself
      const userIdFromArgs = args[0].match(/\d+/)[0];
      try {
        dbUser = await User.findOne({ "account.userId": userIdFromArgs }); // retrieves the user mentioned in as argument eg: !profile @Ignore
      } catch (error) {
        console.error("error: ", error);
        dbUser = user; // failsafe. If user tries to get the profile from someone who does not exist
      }
    } else {
      dbUser = user;
    }
    const prettifiedUser = prettifyUser(dbUser);
    message.channel.send(prettifiedUser);
  },
};
