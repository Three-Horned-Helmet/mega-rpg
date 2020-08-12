const Discord = require("discord.js");
const { onCooldown } = require("../_CONSTS/cooldowns");
const { getWeeklyPrize } = require("../_CONSTS/weeklyPrize");
const { getIcon } = require("../_CONSTS/icons");

const handleWeekly = async (user) => {
	const onCooldownInfo = onCooldown("weeklyPrize", user);
	if (onCooldownInfo.response) {
		return onCooldownInfo.embed;
	}

	const now = new Date();
	const cooldownInMs = new Date(user.cooldowns.weeklyPrize).getTime();


	const lastClaimMoreThanTwoWeeks = new Date(cooldownInMs + (1000 * 60 * 60 * 24 * 7 * 2)) <= now;

	let consecutiveWeek = user.consecutivePrizes.weeklyPrize;

	// todo, should not rely testuser account
	if (lastClaimMoreThanTwoWeeks && user.account.testUser === false) {
		consecutiveWeek = 0;
	}
	if (consecutiveWeek >= 4) {
		consecutiveWeek = 4;
	}

	const weeklyPrizeResult = getWeeklyPrize(consecutiveWeek);
	user.handleConsecutive(weeklyPrizeResult, (consecutiveWeek + 1), "weeklyPrize");
	user.setNewCooldown("weeklyPrize", now);

	const embededResult = generatePrizeEmbed(weeklyPrizeResult, consecutiveWeek);
	await user.save();
	return embededResult;
};

const generatePrizeEmbed = (result, consecutiveWeek) => {
	const sideColor = "#45b6fe";

	const preTitle = " WEEKLY PRIZE  ";
	const star = getIcon("weeklyPrizeStar", "icon");
	const consecutiveStars = star.repeat(consecutiveWeek + 1);

	const title = `${consecutiveStars} ${preTitle} ${consecutiveStars}`;
	// "🌟🌟🌟 WEEKLY PRIZE 🌟🌟🌟"


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
		.setFooter(`This is your ${lexicon[consecutiveWeek]} consecutive week!`);

	return embedUser;
};


module.exports = { handleWeekly };
