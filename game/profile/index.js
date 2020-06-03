const Discord = require("discord.js");

const prettifyUser = (message, user) => {


  const sideColor = "#45b6fe";
  const patreonSupporter = determineSupporterTitle(user.account.patreon);

  const patreonUrl = "https://www.patreon.com";
  const username = `${user.account.username}'s profile`;

  const { hero } = user
  const heroRank = hero.level
  const heroValue = `❤️ HP: ${hero.health}\n\n⚔ AT: ${hero.attack}\n\n🛡 DEF: ${hero.defense}\n\n🔅 XP: ${hero.currentExp}/${hero.expToNextRank}`

  const heroEquipment = `🧢 Helmet: ${hero.armor.helmet}\n\n⚜️ Chest: ${hero.armor.chest}\n\n🦵 Leggings: ${hero.armor.leggings}\n\n🗡 Weapon: ${hero.armor.weapon}`

  const totalSoldiers = getAllSoldiers(user.army.units)
  const armyAttack = Math.floor(Math.random() * (totalSoldiers + 1) * 1000) // todo, fix this
  const armyDefense = Math.floor(Math.random() * (totalSoldiers + 1) * 1000) // todo, fix this

  const armyValue = `👮‍♀️ Soldiers: ${totalSoldiers}\n\n⚔ AT: ${armyAttack}\n\n🛡 DEF: ${armyDefense}`

  const inventoryValue = `💰 Gold: ${user.resources.gold}\n\n🧪 Small Potion: ${hero.inventory['Small Heal Potion']}\n\n💉 Large Potion: ${hero.inventory['Large Heal Potion']}`

  const pvpRank = Math.floor(Math.random() * 10) // todo, fix this
  const totalRank = Math.floor(Math.random() * 10) // todo, fix this

  // inside a command, event listener, etc.
  const embedUser = new Discord.MessageEmbed()
    .setTitle(patreonSupporter)
    .setURL(patreonUrl)
    .setAuthor(username)
    .setColor(sideColor)
    .addFields(
      {
        name: `Hero (${heroRank})`,
        value:
          heroValue,
        inline: true,
      },
      {
        name: "Hero equipment",
        value: heroEquipment,
        inline: true,
      },
      { name: "\u200B", value: "\u200B" },
      {
        name: "Army",
        value: armyValue,
        inline: true,
      },
      { name: "Inventory", value: inventoryValue, inline: true }
    )

    .setFooter(`PVP: #${pvpRank} ~~~ Total: #${totalRank}`);
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

// cleanCode.com
const getAllSoldiers = (units) => {
  let result = 0
  Object.keys(units).forEach(b => {
    Object.values(units[b]).forEach(n => {
      if (typeof n === 'number') {
        result += n
      }
    })
  })

  return result

}

module.exports = { prettifyUser };
