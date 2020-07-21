const Discord = require("discord.js");
const { generateTip, determineSupporterTitle, getAllSoldiers, getPlayerPosition } = require("./helper");
const { getIcon } = require("../_CONSTS/icons");
const calculateStats = require("../../combat/calculate-stats");

const prettifyUser = async (message, user, avatar) => {

	const sideColor = "#45b6fe";
	const patreonSupporter = determineSupporterTitle(user.account.patreon);

	const patreonUrl = "https://www.patreon.com/megarpg";
	const userElo = user.hero.elo || 1200;

	const eloPosition = await getPlayerPosition(message.author.id, "hero.elo");
	// const xpRank = await getPlayerPosition(message.author.id);

	const username = `( ${eloPosition} ) ${user.account.username}'s profile `;

	const { hero } = user;
	const heroRank = hero.rank;
	const heroValue = `❤️ HP: ${hero.currentHealth}/${hero.health}\n\n⚔ AT: ${hero.attack}\n\n🛡 DEF: ${hero.defense}\n\n🔅 XP: ${hero.currentExp}/${hero.expToNextRank}`;

	const heroEquipment = `🧢 Helmet: ${hero.armor.helmet.capitalize()}\n\n⚜️ Chest: ${hero.armor.chest.capitalize()}\n\n🦵 Leggings: ${hero.armor.legging.capitalize()}\n\n🗡 Weapon: ${hero.armor.weapon.capitalize()}`;

	const totalSoldiers = getAllSoldiers(user.army.units);
	const armyStats = calculateStats(user);

	const armyValue = `👮‍♀️ Soldiers: ${totalSoldiers}\n\n⚔ AT: ${armyStats.unitStats.attack}\n\n❤️ HP: ${armyStats.unitStats.health}`;

	const inventoryValue = `💰 Gold: ${user.resources.gold}\n\n🧪 Small Potion: ${hero.inventory["Small Healing Potion"]}\n\n💉 Large Potion: ${hero.inventory["Large Healing Potion"]}`;

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
			dungeonKeys.value.push(`${getIcon(dk)} ${dk} \n`);
		}
	});
	if (dungeonKeys.value.length) {
		fields.splice(2, 0, dungeonKeys);
	}

	const embedUser = new Discord.MessageEmbed()
		.setTitle(patreonSupporter)
		.setDescription(`_Elo: ${userElo}_`)
		.setURL(patreonUrl)
		.setAuthor(username)
		.setColor(sideColor)
		.addFields(
			...fields,
		);

	if (avatar) {
		embedUser.setThumbnail(avatar);
	}
	if (Math.random() > 0.66) {
		embedUser.setFooter(generateTip());
	}

	return embedUser;
};

module.exports = { prettifyUser };
