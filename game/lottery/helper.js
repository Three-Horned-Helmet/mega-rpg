const { getIcon } = require("../_CONSTS/icons");
const Lottery = require("../../models/Lottery");
const { DEFAULT_GOLD_AWARD } = require("./CONTS");

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
		await latestLotteryRaffle.determineWinner();
		latestLotteryRaffle = await createNewLottery();
	}

	return latestLotteryRaffle;
};


const getWinnerPercentage = (userId, lottery)=>{
	const user = lottery.currentContestors.find(c=> c.userId === userId);
	const base = user.ticketAmount;
	const total = lottery.currentContestors.reduce((acc, curr)=>{
		return acc + curr.ticketAmount;
	}, 0);
	return `${(base / total * 100).toFixed(1)}%`;
};

const getLotteryPrizePool = (lottery)=>{
	const carrot = lottery.prizePool.Carrot ? `\n ${getIcon("Carrot")}` : "";
	return `${getIcon("gold")} ${lottery.prizePool.gold} ${carrot} `;
};

const createNewLottery = async ()=>{
	const Carrot = Math.round(Math.random());
	const lottery = new Lottery({
		prizePool: {
			gold: DEFAULT_GOLD_AWARD,
			Carrot
		},
		// 24 hours from now
		nextDrawing: new Date(Date.now() + 86400000),

	});
	return lottery.save();
};

const getPreviousLotteryInformation = lottery => {
	if (!lottery) {
		return `${getIcon("miniboss")} C'Thun`;
	}
	const { previousWinner, prizePool } = lottery;

	const goldPrize = `${getIcon("gold")} ${prizePool.gold}`;
	const carrot = prizePool.Carrot ? `\n${getIcon("Carrot")} ${prizePool.Carrot}` : "";

	const probability = getWinnerPercentage(previousWinner.userId, lottery);
	const result = [`${previousWinner.username} (${probability} chance)`, `${goldPrize}`];
	if (carrot) {
		result[1] += carrot;
	}

	return result;
};

const getCurrentLotteryInformation = lottery =>{
	const contestors = lottery.currentContestors.map(c=> {
		return `**${c.username}** ${getWinnerPercentage(c.userId, lottery)}`;
	});

	if (contestors.lenth > 5) {
		return `${contestors.slice(0, 5)} \n.. and${contestors.length} more`;
	}
	return contestors;
};


module.exports = { findOrSetupLottery, getWinnerPercentage, getLotteryPrizePool, getPreviousLotteryInformation, getCurrentLotteryInformation };