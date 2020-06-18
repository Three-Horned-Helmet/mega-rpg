const Discord = require("discord.js");
const { determineSupporterTitle, getAllSoldiers, getPlayerPosition } = require("./helper");
const { getDungeonIcon } = require("../_CONSTS/icons");
const calculateStats = require("../../combat/calculate-stats");

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
	const armyStats = calculateStats(user);

	const armyValue = `👮‍♀️ Soldiers: ${totalSoldiers}\n\n⚔ AT: ${armyStats.unitStats.attack}\n\n❤️ HP: ${armyStats.unitStats.health}`;

	const inventoryValue = `💰 Gold: ${user.resources.gold}\n\n🧪 Small Potion: ${hero.inventory["Small Heal Potion"]}\n\n💉 Large Potion: ${hero.inventory["Large Heal Potion"]}`;

	const fields = [
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
	];

	const dungeonKeys = {
		name: "Dungeon Keys",
		value: [],
		inline: true,
	};

	Object.keys(hero.dungeonKeys).forEach(dk=>{
		if (hero.dungeonKeys[dk] && !dk.startsWith("$")) {
			dungeonKeys.value.push(`${getDungeonIcon(dk)} ${dk} \n`);
		}
	});
	if (dungeonKeys.value.length) {
		fields.splice(2, 0, dungeonKeys);
	}

	// todo, fix this
	const pvpRank = "provisional";
	const totalRank = await getPlayerPosition(message.author.id);

	const embedUser = new Discord.MessageEmbed()
		.setTitle(patreonSupporter)
		.setURL(patreonUrl)
		.setAuthor(username)
		.setColor(sideColor)
		.addFields(
			...fields,
		)

		.setFooter(`Ranking: PVP: ${pvpRank} ~~~ Total: #${totalRank}`);

	return embedUser;
};

module.exports = { prettifyUser };
