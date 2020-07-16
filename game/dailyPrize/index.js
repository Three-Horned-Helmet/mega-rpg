const Discord = require("discord.js");
const { onCooldown } = require("../_CONSTS/cooldowns");
const { getDailyPrize } = require("../_CONSTS/dailyPrize");
const { getIcon } = require("../_CONSTS/icons");

const handleDaily = async (user) => {
	const onCooldownInfo = onCooldown("dailyPrize", user);
	if (onCooldownInfo.response) {
		return onCooldownInfo.embed;
	}
	const now = new Date();
	const lastClaimLessThanTwoDays = user.cooldowns.dailyPrize + 1000 * 60 * 60 * 48 >= now;

	let consecutiveDay = user.consecutivePrizes.dailyPrize;

	if (lastClaimLessThanTwoDays) {
		consecutiveDay = 0;
	}
	if (consecutiveDay >= 4) {
		consecutiveDay = 4;
	}

	const dailyPrizeResult = getDailyPrize(consecutiveDay);
	await user.handleConsecutive(dailyPrizeResult, (consecutiveDay + 1), now, "dailyPrize");


	const embededResult = generatePrizeEmbed(dailyPrizeResult, consecutiveDay);
	return embededResult;
};

const generatePrizeEmbed = (result, consecutiveDay)=>{
	const sideColor = "#45b6fe";

	const preTitle = " DAILY PRIZE  ";
	const star = getIcon("dailyPrizeStar", "icon");
	const consecutiveStars = star.repeat(consecutiveDay + 1);

	const title = `${consecutiveStars} ${preTitle} ${consecutiveStars}`;
	// "⭐️⭐️⭐️ DAILY PRIZE ⭐️⭐️⭐️"

	let valueField = "";

	Object.keys(result).forEach(r=>{
		valueField += `${getIcon(r)} ${r}: ${result[r]}\n`;
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
