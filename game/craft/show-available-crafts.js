const Discord = require("discord.js");
const icons = require("../../icons/icons");
const allItems = require("../items/all-items");

const craftsEmbed = (user) => {
    const title = `${user.account.username}'s available crafts:`;
    const sideColor = "#45b6fe";

    const fields = Object.values(allItems).filter(item => {
        const { building, level } = item.requirement;
        return user.empire.find(b => b.name === building && b.level >= level);
    }).map(item => {
        return addCraftsField(item);
   });

    if(fields.length === 0) {
        fields.push({
            name: "You need a building like blacksmith, armorer or forge to craft items",
            value: "\u200B",
        });
    }

    if((fields.length + 2) % 3) {
        fields.push({
            name: "\u200B",
            value: "\u200B",
            inline: true,
        });
    }

	const embedCrafts = new Discord.MessageEmbed()
		.setTitle(title)
		.setColor(sideColor)
		.addFields(
			...fields,
		);

	// .setFooter(`PVP: #${pvpRank} ~~~ Total: #${totalRank}`);
	return embedCrafts;
};

const addCraftsField = (item) => {
    const { name, typeSequence, cost, stats } = item;

    const field = {
        name: name.capitalize(),
        value: `${typeSequence[typeSequence.length - 1].capitalize()} \n ${objectMessage(stats)} ${objectMessage(stats) ? "\n" : ""} ${objectMessage(cost)}`,
        inline: true,
    };

    return field;
};

const objectMessage = (costs) => {
	let message = "";

	for(const cost in costs) {
		message += `${icons[cost] || ""} ${cost.capitalize()}: ${costs[cost]} \n`;
	}

	return message;
};

module.exports = craftsEmbed;