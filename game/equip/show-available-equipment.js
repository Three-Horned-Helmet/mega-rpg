const Discord = require("discord.js");
const { getIcon } = require("../_CONSTS/icons");
const allItems = require("../items/all-items");
const { getTowerItem } = require("../items/tower-items/tower-item-functions");

const equipmentEmbed = (user) => {
	const title = `${user.account.username}'s available equipment (usage: \`!equip <itemName>\`):`;
	const sideColor = "#45b6fe";

	// Adds the different items and stats to the field
	const fields = Object.keys(user.army.armory).filter(el => !el.startsWith("$")).map(iType => {
		return addEquipmentField(user, iType);
	});

	// Adds current equipment
	const currentEquipFields = Object.keys(user.hero.armor).filter(el => !el.startsWith("$")).map(iType => addCurrentEquipment(user, iType));

	if(currentEquipFields.length > 0) {
		const currentEquipHeader = {
			name: "\u200B",
			value: "**__Equipped Items:__**",
		};
		const inventoryItemsHeader = {
			name: "\u200B",
			value: "**__Inventory:__**",
		};

		fields.unshift(currentEquipHeader, ...currentEquipFields, inventoryItemsHeader);
	}

	// If the user has no equipment
	if(fields.length === 0) {
		fields.push({
			name: "You dont have any equipment in your inventory. You can craft some if you have a blacksmith or armorer",
			value: "Try `!build blacksmith` followed by `!craft bronze sword` to get started. You can then equip the bronze sword with `!equip bronze sword`",
		});
	}

	if((fields.length + 2) % 3) {
		fields.push({
			name: "\u200B",
			value: "\u200B",
			inline: true,
		});
	}

	const embedEquipment = new Discord.MessageEmbed()
		.setTitle(title)
		.setColor(sideColor)
		.addFields(
			...fields,
		);

	return embedEquipment;
};

const addEquipmentField = (user, iType) => {
	const items = Object.keys(user.army.armory[iType]).sort((a, b)=> sortHelper(a) - sortHelper(b));

	const value = items.map(item => {
		const itemAmount = user.army.armory[iType][item];
		if(!itemAmount) return false;
		const itemObj = allItems[item] || getTowerItem(item);
		return `[${itemAmount}] ${item.capitalize()}\n${objectMessage(itemObj.stats)}`;
	}).filter(el => el);


	const field = {
		name: `${iType.capitalize()}s`,
		value: value.length > 0 ? value : "[NONE]",
		inline: true,
	};

	return field;
};

const objectMessage = (stats) => {
	let message = "";

	for(const stat in stats) {
		message += `${getIcon(stat) || ""} ${stat.capitalize()}: ${stats[stat]} \n`;
	}

	return message;
};

// Can be optimized without having to call getTowerItem or allItems if the user doesn't own the item anyways
const sortHelper = (a) => {
	const item = allItems[a] || getTowerItem(a);
	return Object.values(item.stats).reduce((acc, cur) => acc + cur);
};

const addCurrentEquipment = (user, iType) => {
	const item = user.hero.armor[iType];

	const itemObj = allItems[item] || getTowerItem(item);
	let value;

	if(itemObj) {
		value = `${item.capitalize()}\n${objectMessage(itemObj.stats)}`;
	}

	const field = {
		name: `${iType.capitalize()}s`,
		value: value ? value : "[NONE]",
		inline: true,
	};

	return field;
};

module.exports = equipmentEmbed;