const Discord = require("discord.js");
const { determineSupporterTitle, getAllSoldiers, getPlayerPosition } = require("./helper");
const { getDungeonIcon } = require("../_CONSTS/icons");

const prettifyUser = async (message, user) => {

	const sideColor = "#45b6fe";
	const patreonSupporter = determineSupporterTitle(user.account.patreon);

	const patreonUrl = "https://www.patreon.com/megarpg";
	const username = `${user.account.username}'s profile`;

	const { hero } = user;
	const heroRank = hero.rank;
	const heroValue = `❤️ HP: ${hero.currentHealth}/${hero.health}\n\n⚔ AT: ${hero.attack}\n\n🛡 DEF: ${hero.defense}\n\n🔅 XP: ${hero.currentExp}/${hero.expToNextRank}`;

	const heroEquipment = `🧢 Helmet: ${hero.armor.helmet}\n\n⚜️ Chest: ${hero.armor.chest}\n\n🦵 Leggings: ${hero.armor.legging}\n\n🗡 Weapon: ${hero.armor.weapon}`;

	const totalSoldiers = getAllSoldiers(user.army.units);
	const armyAttack = Math.floor(Math.random() * (totalSoldiers + 1) * 20); // todo, fix this
	const armyDefense = Math.floor(Math.random() * (totalSoldiers + 1) * 20); // todo, fix this

	const armyValue = `👮‍♀️ Soldiers: ${totalSoldiers}\n\n⚔ AT: ${armyAttack}\n\n🛡 DEF: ${armyDefense}`;

	let inventoryValue = `💰 Gold: ${user.resources.gold}\n\n🧪 Small Potion: ${hero.inventory["Small Heal Potion"]}\n\n💉 Large Potion: ${hero.inventory["Large Heal Potion"]}`;

		Object.keys(hero.dungeonKeys).forEach(dk=>{

			if (hero.dungeonKeys[dk] && !dk.startsWith("$")) {
				inventoryValue += `\n\n${getDungeonIcon(dk)} ${dk} ${hero.dungeonKeys[dk]} `;
			}
		});

	const pvpRank = "provisional"; // todo, fix this
	const totalRank = await getPlayerPosition(message.author.id);

	const embedUser = new Discord.MessageEmbed()
		.setTitle(patreonSupporter)
		.setURL(patreonUrl)
		.setAuthor(username)
		.setColor(sideColor)
		.addFields(
			{
				name: `Hero (${heroRank})`,
				value: heroValue,
				inline: true,
			},
			{
				name: "Hero Armor Equipped",
				value: heroEquipment,
				inline: true,
			},
			{ name: "\u200B", value: "\u200B" },
			{
				name: "Army",
				value: armyValue,
				inline: true,
			},
			{ name: "Inventory", value: inventoryValue, inline: true },
		)

		.setFooter(`Ranking: PVP: ${pvpRank} ~~~ Total: #${totalRank}`);

	return embedUser;
};

module.exports = { prettifyUser };
