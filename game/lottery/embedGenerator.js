const Discord = require("discord.js");
const { getIcon } = require("../_CONSTS/icons");
const { msToHumanTime } = require("../_GLOBAL_HELPERS/index");
const { getPreviousLotteryInformation, getCurrentLotteryInformation, getLotteryPrizePool, getWinnerPercentage } = require("./helper");

const { PRIZE_FOR_LOTTERY_TICKET } = require("./CONTS");

const generateLotteryInformationEmbed = (lotteries)=>{

	const previousLotteryInfo = getPreviousLotteryInformation(lotteries[1]);
	const currentLotteryInfo = getCurrentLotteryInformation(lotteries[0]);

	const title = `${getIcon("lottery")} **LOTTERY** ${getIcon("lottery")}`;

	const description = [
		`Prize for ticket: ${getIcon("gold")} ${PRIZE_FOR_LOTTERY_TICKET} \nCurrent Prizepool: ${getLotteryPrizePool(lotteries[0])}\n`,
		`Time remaining until winner is picked:\n${getDrawTime(lotteries[0])}`];
	const footer = "How to buy tickets: !buy lottery 5";
	const fields = [
		{
			name: "Previous lottery Winner",
			value: previousLotteryInfo,
			inline: true,
		},
		{
			name: "Current contestors:",
			value: currentLotteryInfo,
			inline: true,
		},

	];
	const purchaseEmbed = new Discord.MessageEmbed()

		.setColor("#0099ff")
		.setTitle(title)
		.setDescription(description)
		.addFields(...fields)
		.setFooter(footer);
	return purchaseEmbed;
};

const generateLotteryPurchaseEmbed = (username, userId, amount, latestLotteryRaffle)=>{
	const chanceToWin = getWinnerPercentage(userId, latestLotteryRaffle);
	const prizes = getLotteryPrizePool(latestLotteryRaffle);
	const timeRemaining = getDrawTime(latestLotteryRaffle);

	const fields = [
		{
			name: "Current Prizes",
			value: prizes,
			inline: true,
		},
		{
			name: `Current chance to win for ${username}`,
			value: chanceToWin,
			inline: true,
		},

	];
	const purchaseEmbed = new Discord.MessageEmbed()

		.setColor("#0099ff")
		.setTitle(`${getIcon("lottery")} ${username} purchased ${amount} lottery ticket${amount === 1 ? "" : "s"}! ${getIcon("lottery")}`)
		.setDescription(`Each tickets cost ${getIcon("gold")} ${PRIZE_FOR_LOTTERY_TICKET}`)
		.addFields(...fields)
		.setFooter(`The winner will be picked at ${timeRemaining}`);
	return purchaseEmbed;
};

const getDrawTime = lottery => {
	return msToHumanTime(lottery.nextDrawing.getTime() - Date.now());
};


module.exports = { generateLotteryInformationEmbed, generateLotteryPurchaseEmbed };