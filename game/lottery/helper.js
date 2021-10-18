const { getIcon } = require("../_CONSTS/icons");
const Lottery = require("../../models/Lottery");
const User = require("../../models/User");
const { DEFAULT_GOLD_AWARD, MAX_ALLOWED_TICKETS } = require("./CONTS");


const findOrSetupLottery = async ()=>{
	const now = Date.now();
	let latestLotteryRaffle;
	try {
		latestLotteryRaffle = await Lottery
			.findOne()
			.sort({ nextDrawing: -1 });
	}
	catch (err) {
		console.error("Error: ", err);
	}

	// creates a lottery if none found
	if (!latestLotteryRaffle) {
		latestLotteryRaffle = await createNewLottery();
	}
	// creates a lottery if the previous one has been claimed or time have run out
	if (latestLotteryRaffle.nextDrawing.getTime() <= now) {
		const previousLotteryResult = await latestLotteryRaffle.determineWinner();
		if (previousLotteryResult && previousLotteryResult.previousWinner.userId) {
			const previousWinner = await User.findOne({ "account.userId": previousLotteryResult.previousWinner.userId });
			previousWinner.gainManyResources(previousLotteryResult.prizePool);
			await previousWinner.save();
		}

		latestLotteryRaffle = await createNewLottery();
	}

	return latestLotteryRaffle;
};


const getWinnerPercentage = (userId, lottery)=>{
	if (!lottery || lottery.currentContestors.length === 0) {
		return;
	}
	const user = lottery.currentContestors.find(c=> c.userId === userId);
	const base = user.ticketAmount;
	const total = lottery.currentContestors.reduce((acc, curr)=>{
		return acc + curr.ticketAmount;
	}, 0);
	return `${(base / total * 100).toFixed(1)}%`;
};

const getLotteryPrizePool = (lottery)=>{
	// will be added later (add to end of return statement)
	// const carrot = lottery.prizePool.Carrot ? `\n ${getIcon("Carrot")}` : "";
	return `${getIcon("gold")} ${lottery.prizePool.gold} `;
};

const createNewLottery = async ()=>{
	// will be added later
	// const Carrot = Math.round(Math.random());
	const lottery = new Lottery({
		prizePool: {
			gold: DEFAULT_GOLD_AWARD,
			// Carrot
		},
		// 24 hours from now
		nextDrawing: new Date(Date.now() + 86400000),

	});
	return lottery.save();
};

const getPreviousLotteryInformation = lottery => {
	if (!lottery || !lottery.previousWinner || lottery.currentContestors.length === 0) {
		return `${getIcon("miniboss")} C'Thun`;
	}
	const { previousWinner, prizePool } = lottery;

	const goldPrize = `${getIcon("gold")} ${prizePool.gold}`;
	// will be added later
	// const carrot = prizePool.Carrot ? `\n${getIcon("Carrot")} ${prizePool.Carrot}` : "";

	const probability = getWinnerPercentage(previousWinner.userId, lottery);
	const result = [`${previousWinner.username} (${probability} chance)\n ${goldPrize}`];
	/* if (carrot) {
		result[1] += carrot;
	} */

	return result;
};

const getCurrentLotteryInformation = lottery =>{
	if (!lottery || lottery.currentContestors.length === 0) {
		return "None";
	}
	const contestors = lottery.currentContestors.map(c=> {
		return `**${c.username}** ${getWinnerPercentage(c.userId, lottery)}`;
	});

	if (contestors.lenth > 5) {
		return `${contestors.slice(0, 5)} \n.. and${contestors.length} more`;
	}
	return contestors;
};

const validateLotteryPurchase = (user, prizeToPay, amount, latestLotteryRaffle) => {
	// checks if the player have more tickets than allowed
	const amountOfTickets = parseInt(amount, 10);
	const contestor = latestLotteryRaffle.currentContestors.find(c=> c.userId === user.account.userId);
	if ((!!contestor && contestor.ticketAmount + amountOfTickets > MAX_ALLOWED_TICKETS) || amountOfTickets > MAX_ALLOWED_TICKETS) {
		return `Max ${MAX_ALLOWED_TICKETS} tickets can be purchased for each lottery raffle\nYou currently have ${contestor ? contestor.ticketAmount : 0} `;
	}


	if (user.resources.gold <= prizeToPay) {
		const plural = amountOfTickets === 1 ? "" : "s";
		return `Insufficent funds! \n You need ${getIcon("gold")} ${prizeToPay} gold when buying ${amountOfTickets} ticket${plural}!`;
	}

	// User has high enough shop level?
	if(!user.empire.find(b => b.name === "shop" && b.level >= 2)) {
		return "You need shop level 2 to buy lottery tickets";
	}
	return null;
};


module.exports = { findOrSetupLottery, getWinnerPercentage, getLotteryPrizePool, getPreviousLotteryInformation, getCurrentLotteryInformation, validateLotteryPurchase };
