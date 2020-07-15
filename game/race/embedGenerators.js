const Discord = require("discord.js");
const { getIcon } = require("../_CONSTS/icons");
const GOLDPRICE = 40;

const generateRace = (event)=>{
	const sideColor = "#45b6fe";
	const racers = Object.keys(event.raceDataCopy).map(r=>{
		let finishTile = "🏁";
		let { dotsLength } = event.raceDataCopy[r];
		if (dotsLength < 1) {
			finishTile = r;
			dotsLength = 1;
			r = ". . . ";
		}
		if (dotsLength > 20) {
			dotsLength = 20;
		}
		const firstDots = ". ".repeat(dotsLength);
		const lastDots = ". ".repeat(20 - dotsLength);
		return `${finishTile}${firstDots}${r}${lastDots}`;
	});

	let leadingCharacter;
	let fewestDots = 30;
	Object.keys(event.raceDataCopy).forEach(r=>{
		if (event.raceDataCopy[r].dotsLength < fewestDots) {
			fewestDots = event.raceDataCopy[r].dotsLength;
			leadingCharacter = r;
		}
	});

	const leader = `Leader: ${leadingCharacter}\n`;
	const betters = new Set();
	event.participants.forEach((betInfo, username)=>{
		betters.add(`${betInfo.racer} ${username}`);
	});

	const embedRace = new Discord.MessageEmbed()
		.setTitle("🏇 RACE! 🏇")
		.setColor(sideColor)
		.addFields(
			{
				name: "Bets\n",
				value: Array.from(betters),
				inline: true,
			},
		)
		.addFields(
			{
				name: leader,
				value: racers,
				inline: true,
			},
		);
	return embedRace;
};

const generateEndResult = (event)=> {
	const sideColor = "#45b6fe";
	const winners = [];
	const losers = [];
	event.participants.forEach((betInfo, username)=>{
		if (betInfo.racer === event.winner) {
			winners.push(username);
		}
		else {
			losers.push(username);
		}
	});
	const winningCharacter = event.winner;

	let weightedMultiplier = 20 - event.raceDataCopy[event.winner].weight;
	weightedMultiplier = weightedMultiplier ? weightedMultiplier : 1;

	const reward = weightedMultiplier * GOLDPRICE + 40;

	const winningTitle = `\n Every winner get ${getIcon("gold")} ${reward}:`;
	const losingTitle = "\n Losers get nothin':";

	const fields = [];
	if (winners.length) {
		fields.push({
			name: winningTitle,
			value: winners,
			inline: true,
		});
	}
	if (losers.length) {
		fields.push({
			name: losingTitle,
			value: losers,
			inline: true,
		});
	}


	const winningResults = new Discord.MessageEmbed()
		.setTitle("🏇 RACE OVER! 🏇")
		.setDescription(`WINNER IS: ${winningCharacter}\n`)
		.setColor(sideColor)
		.addFields(
			...fields,
		);
	return winningResults;
};

const createRaceInvitation = (user, raceDataCopy)=>{
	const sideColor = "#45b6fe";
	const { username } = user.account;


	const racers = Object.keys(raceDataCopy).map(r=>{
		let weightedMultiplier = 20 - raceDataCopy[r].weight;
		weightedMultiplier = weightedMultiplier ? weightedMultiplier : 1;
		return `${r} --- ${getIcon("gold")} ${(weightedMultiplier * GOLDPRICE) + 40}`;
	});
	const bettingState = "```diff\n+ PLACE YOUR BETS! ```";
	const footer = "Click the racer you think will win!";


	const embedInvitation = new Discord.MessageEmbed()
		.setTitle(`🏇 ${username} is inviting to a race!! 🏇`)
		.setDescription(`Costs ${getIcon("gold")} ${GOLDPRICE} to participate!`)
		.setColor(sideColor)
		.addFields(
			{
				name: "Racers & Rewards:",
				value: racers,
				inline: false,
			},
			{
				name: "Betting status:",
				value: bettingState,
				inline: false,
			},
		)
		.setFooter(footer);

	return embedInvitation;
};

module.exports = { generateRace, generateEndResult, createRaceInvitation };