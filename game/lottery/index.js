const Discord = require("discord.js");
const Lottery = require("../../models/Lottery");

const PRIZE_FOR_LOTTERY_TICKET = 80;
const MAX_ALLOWED_TICKETS = 100;
const DEFAULT_GOLD_AWARD = 500;


const handleLottery = async (user, amountOfTickets)=>{
	const amount = Array.isArray(amountOfTickets) ? parseInt(amountOfTickets[0]) : parseInt(amount);
	const prizeToPay = amount * PRIZE_FOR_LOTTERY_TICKET;
	const { userId, username } = user.account;
	const now = Date.now();

	// checks if player have enough gold
	if (user.resources.gold <= prizeToPay) {
		return `Insufficent funds! \n You need ICON ${prizeToPay} gold when buying ${amount} tickets!`;
	}


	// finds the last created lottery
	let latestLotteryRaffle;
	try {
		latestLotteryRaffle = await Lottery.findOne().sort({ created_at: -1 });
	}
	catch (err) {
		console.error("Error: ", err);
	}

	// creates a lottery if none found
	if (!latestLotteryRaffle) {
		latestLotteryRaffle = await createNewLottery();
	}

	// creates a lottery if the previous one has been claimed or time have run out
	if (latestLotteryRaffle.claimed || latestLotteryRaffle.nextDrawing.getTime() <= now) {
		await latestLotteryRaffle.determineWinner();
		latestLotteryRaffle = await createNewLottery();
	}

	// checks if the player have more tickets than allowed
	if (latestLotteryRaffle.currentContestors.length) {
		const contestor = latestLotteryRaffle.currentContestors.find(c=> c.userId === userId);
		if (contestor && contestor.ticketAmount + amount > MAX_ALLOWED_TICKETS) {
			return `Max ${MAX_ALLOWED_TICKETS} tickets can be purchased for each lottery raffle\nYou currently have ${contestor.ticketAmount} `;
		}
	}

	// removes gold from user and add user to lottery
	try{
		await user.removeManyResources({ gold:prizeToPay });
		await latestLotteryRaffle.addContestor(username, userId, amount, PRIZE_FOR_LOTTERY_TICKET);
	}
	catch (err) {
		console.error("Error: ", err);
	}

	await user.save();
	await latestLotteryRaffle.save();

	const purchaseEmbed = generateLotteryPurchaseEmbed(username, userId, amount, latestLotteryRaffle);

	return purchaseEmbed;

};

module.exports = { handleLottery };


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
			name: "Current chance to win",
			value: chanceToWin,
			inline: false,
		},

	];


	const purchaseEmbed = new Discord.MessageEmbed()

		.setColor("#0099ff")
		.setTitle(`${username} purchased ${amount} of lottery tickets!`)
		.addFields(...fields)
		.setFooter(`The winner will be picked at ${timeRemaining}`);
	return purchaseEmbed;
};

const getDrawTime = lottery => {
	return "Probably one day";
};

const getWinnerPercentage = (userId, lottery)=>{
	const user = lottery.currentContestors.find(c=> c.userId === userId);
	const base = user.amount;
	const total = lottery.currentContestors.reduce((acc, curr)=>{
		acc + curr.amount;
	}, 0);
	return (base / total * 100).toFixed(2);

};

const getLotteryPrizePool = (lottery)=>{
	const carrot = lottery.prizePool.Carrot ? `\n ${lottery.prizePool.Carrot} Icon` : "";
	return `${lottery.prizePool.gold} Icon ${carrot} `;
};

const createNewLottery = async ()=>{
	const Carrots = Math.round(Math.random());
	const lottery = new Lottery({
		prizePool: {
			gold: DEFAULT_GOLD_AWARD,
			Carrots
		},
		// 24 hours from now
		nextDrawing: new Date(Date.now() + 86400000),

	});
	return lottery.save();
};
