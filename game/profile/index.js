const Discord = require("discord.js");
const { generateTip, getSupporterTitle, getAllSoldiers } = require("./helper");
const { getIcon } = require("../_CONSTS/icons");
const calculateStats = require("../../combat/calculate-stats");

const prettifyUser = (position, user, avatar) => {

	const sideColor = "#45b6fe";
	const patreonSupporter = getSupporterTitle(user.account.patreon);

	const patreonUrl = "https://www.patreon.com/megarpg";
	const userElo = user.hero.elo || 1200;

	let username = `( ${position} ) ${user.account.username}'s profile `;

	if (position < 4) {
		const medals = ["🥇", "🥈", "🥉"];
		username += medals[position - 1];
	}

	const { hero, resources } = user;
	const { rank, currentHealth, health, attack, defense, currentExp, expToNextRank, armor, inventory } = hero;
	const heroValue = `❤️ HP: ${currentHealth}/${health}\n\n⚔ AT: ${attack}\n\n🛡 DEF: ${defense}\n\n🔅 XP: ${currentExp}/${expToNextRank}`;

	const heroEquipment = `🧢 Helmet: ${hero.armor.helmet.capitalize()}\n\n⚜️ Chest: ${armor.chest.capitalize()}\n\n🦵 Leggings: ${armor.legging.capitalize()}\n\n🗡 Weapon: ${armor.weapon.capitalize()}`;

	const totalSoldiers = getAllSoldiers(user.army.units);
	const armyStats = calculateStats(user);

	const armyValue = `👮‍♀️ Soldiers: ${totalSoldiers}\n\n⚔ AT: ${armyStats.unitStats.attack}\n\n❤️ HP: ${armyStats.unitStats.health}`;

	const inventoryValue = `💰 Gold: ${Math.floor(resources.gold)}\n\n${Object.keys(inventory).map(item => typeof inventory[item] === "number" ? addInventoryValueToProfile(item, hero) : false).filter(i => i).join(" ")}`;

	const fields = [
		{
			name: `Hero (${rank})`,
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

const addInventoryValueToProfile = (item, hero) => {
	return hero.inventory[item] ? `${getIcon(item)} ${item}: ${hero.inventory[item]}\n\n` : "";
};

module.exports = { prettifyUser };
