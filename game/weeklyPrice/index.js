const Discord = require("discord.js");
const { onCooldown } = require("../_CONSTS/cooldowns");
const { getWeeklyPrice } = require("../_CONSTS/weeklyPrice");
const { getResourceIcon } = require("../_CONSTS/icons");

const handleWeekly = async (user) => {
    const onCooldownInfo = onCooldown("weeklyPrice", user);
    if (onCooldownInfo.response) {
        return onCooldownInfo.embed;
    }
    const now = new Date();
    const lastClaimLessThanTwoDays = user.cooldowns.dailyPrice + 1000 * 60 * 60 * 14 >= now;

    let consecutiveWeek = user.consecutivePrices.weeklyPrice;

    if (lastClaimLessThanTwoDays) {
        consecutiveWeek = 0;
    }
    if (consecutiveWeek >= 4) {
        consecutiveWeek = 4;
    }

    const weeklyPriceResult = getWeeklyPrice(consecutiveWeek);
    await user.handleConsecutive(weeklyPriceResult, (consecutiveWeek + 1), now, "weeklyPrice");

     const embededResult = generatePriceEmbed(weeklyPriceResult, consecutiveWeek);
     return embededResult;
};

const generatePriceEmbed = (result, consecutiveWeek)=>{
    getResourceIcon();

    const sideColor = "#45b6fe";

    const preTitle = " WEEKLY PRIZE  ";
    const consecutiveStars = "🌟".repeat(consecutiveWeek + 1);

    let title = consecutiveStars;
    title += preTitle;
    title += consecutiveStars;
    // "🌟🌟🌟 WEEKLY PRIZE 🌟🌟🌟"


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
		.setFooter(`This is your ${lexicon[consecutiveWeek]} consecutive week!`);

    return embedUser;
};


module.exports = { handleWeekly };
