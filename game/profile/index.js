const Discord = require("discord.js");

const prettifyUser = (user) => {
  console.log(message, 'message', user, "user!!!");

  const backgroundColor = "#abc021";
  const patreonSupporter = determineSupporterTitle(user.account.patreon);

  const patreonUrl = "https://www.patreon.org";
  const username = `${user.account.username}'s profile`;

  // inside a command, event listener, etc.
  const embedUser = new Discord.MessageEmbed()
    .setTitle(patreonSupporter)
    .setURL(patreonUrl)
    .setAuthor(username)
    .setColor("#abc021")
    .addFields(
      /*   { name: "\u200B", value: "\u200B" }, */
      {
        name: "Hero",
        value:
          "❤️ HP: 25\n\n⚔ AT: 10\n\n🛡 DEF: 40\n\n📚 XP:10/100\n\n🔸 Rank: 2",
        inline: true,
      },
      {
        name: "Hero equipment",
        value:
          "🧢 Helmet: Wizards hat\n\n⚜️ Chest: Tshirt\n\n🦵 Leggings: Long socks\n\n🗡 Weapon: Rusty dagger",
        inline: true,
      },
      { name: "\u200B", value: "\u200B" },
      {
        name: "Army",
        value: "👮‍♀️ Soldiers: 40\n\n⚔ AT: 2000\n\n🛡 DEF: 1200",
        inline: true,
      },
      { name: "Resources", value: "💰Gold: 69\n\n🧪 Small Potion: 1\n\n🥤 Large Potion: 0", inline: true }
    )
    .setFooter("PVP: #1 ~~~ Total: #4");
  /* .setDescription("Some description here") */
  /* .setThumbnail("https://i.imgur.com/wSTFkRM.png") */

  /* .addField("Hero")
    .addField("XP: 10 / 100")
    .addField("Level: Grassy Fields")
    .addField("Rank: 4"); */
  /* .addField("Inline field title", "Some value here", true) */
  /* .setImage("https://i.imgur.com/wSTFkRM.png") */
  /*
    
    */

  return embedUser;
};

const determineSupporterTitle = (subscription) => {
  const titles = {
    Bronze: "🎗 Supporter 🎗",
    Silver: "🎖 Supporter 🎖",
    Gold: "👑 Ultra Supporter 👑",
    Platinum: "💎 Epic Supporter 💎",
  };
  const result = subscription ? titles[subscription] : "Casual player";
  return result;
};

module.exports = { prettifyUser };
