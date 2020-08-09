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
	const cooldownInMs = new Date(user.cooldowns.dailyPrize).getTime();

	const lastClaimMoreThanTwoDays = new Date(cooldownInMs + (1000 * 60 * 60 * 24 * 2)) <= now;

	let consecutiveDay = user.consecutivePrizes.dailyPrize;

	// todo, should not rely testuser account
	if (lastClaimMoreThanTwoDays && user.account.testUser === false) {
		consecutiveDay = 0;
	}
	if (consecutiveDay >= 4) {
		consecutiveDay = 4;
	}

	const dailyPrizeResult = getDailyPrize(consecutiveDay);
	user.setNewCooldown("dailyPrize", now);
	user.handleConsecutive(dailyPrizeResult, (consecutiveDay + 1), "dailyPrize");


	const embededResult = generatePrizeEmbed(dailyPrizeResult, consecutiveDay);
	await user.save();
	return embededResult;
};

const generatePrizeEmbed = (result, consecutiveDay) => {
	const sideColor = "#45b6fe";

	const preTitle = " DAILY PRIZE  ";
	const star = getIcon("dailyPrizeStar", "icon");
	const consecutiveStars = star.repeat(consecutiveDay + 1);

	const title = `${consecutiveStars} ${preTitle} ${consecutiveStars}`;
	// "⭐️⭐️⭐️ DAILY PRIZE ⭐️⭐️⭐️"

	let valueField = "";

	Object.keys(result).forEach(r => {
		valueField += `${getIcon(r)} ${r}: ${result[r]}\n`;
	});

	const lexicon = ["first", "second", "third", "fourth", "fifth (max)"];
	const embedUser = new Discord.MessageEmbed()
		.setTitle(title)
		.setColor(sideColor)
		.addFields(
			{
				name: "Reward:",
				value: valueField,
				inline: true,
			},
		)
		.setFooter(`This is your ${lexicon[consecutiveDay]} consecutive day!`);

	return embedUser;
};


module.exports = { handleDaily };
