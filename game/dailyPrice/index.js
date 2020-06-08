const Discord = require("discord.js");
const { onCooldown } = require("../_CONSTS/cooldowns");
const { getDailyPrice } = require("../_CONSTS/dailyPrice");
const { getResourceIcon } = require("../_CONSTS/icons");

const handleDaily = async (user) => {
    const onCooldownInfo = onCooldown("dailyPrice", user);
    if (onCooldownInfo.response) {
        return onCooldownInfo.embed;
    }
    const now = new Date();
    const lastClaimLessThanTwoDays = user.cooldowns.dailyPrice + 1000 * 60 * 60 * 48 >= now;

    let consecutiveDay = user.consecutivePrices.dailyPrice;
    console.log(consecutiveDay, "consecutiveDay");

    if (lastClaimLessThanTwoDays) {
        consecutiveDay = 0;
    }
    if (consecutiveDay >= 4) {
        console.log("more than 4");
        consecutiveDay = 4;
    }

    const dailyPriceResult = getDailyPrice(consecutiveDay);
    await user.handleConsecutive(dailyPriceResult, (consecutiveDay + 1), now, "dailyPrice");


     const embededResult = generatePriceEmbed(dailyPriceResult, consecutiveDay);
     return embededResult;
};

const generatePriceEmbed = (result, consecutiveDay)=>{
    getResourceIcon();

    const sideColor = "#45b6fe";

    const preTitle = " DAILY PRIZE  ";
    const consecutiveStars = "⭐️".repeat(consecutiveDay + 1);

    let title = consecutiveStars;
    title += preTitle;
    title += consecutiveStars;
    // "⭐️⭐️⭐️ DAILY PRIZE ⭐️⭐️⭐️"

    let valueField = "";

            Object.keys(result).forEach(r=>{
                valueField += `${getResourceIcon(r)} ${r}: ${result[r]}\n`;
            });

    const lexicon = ["first", "second", "third", "fourth", "fifth (max)"];
    const embedUser = new Discord.MessageEmbed()
		.setTitle(title)
		.setColor(sideColor)
		.addFields(
			{
				name: "Reward:",
				value:valueField,
				inline: true,
            },
		)
		.setFooter(`This is your ${lexicon[consecutiveDay]} consecutive day!`);

    return embedUser;
};


module.exports = { handleDaily };
