const Discord = require("discord.js");
const { getIcon } = require("../../game/_CONSTS/icons");
const embedColors = require("../../game/_CONSTS/embedColors");

const sideColor = embedColors.info;

const generateMinimalEmbed = (progress) => {
	const { allowedWeapons } = progress.weaponInformation;
	const { teamRed, teamGreen, currentRound, winner, totalRoundInflicted } = progress;
	const { title, teamRedName, teamGreenName } = progress.embedInformation;
	const playerNames = [...teamRed, ...teamGreen].map((player, i)=>{
		return ` **${i < teamRed.length ? ":red_square:" : ":green_square:"}${player.account.username}**`;
	});
	const weaponFormatted = Object.values(allowedWeapons).map(weapon=>{
		return `\`${weapon.answer.toUpperCase()}\` - ${getIcon(weapon.name)} \n`;
	}).join(" ");
	let description = `${playerNames} \n choose your weapon!\n ${weaponFormatted}`;

	// Shows result from previous round
	if (currentRound > 0) {
		const previousResult = `${teamGreenName}: :boom: ${totalRoundInflicted.teamGreen.damage} :test_tube: ${totalRoundInflicted.teamGreen.heal}\n 
		${teamRedName}: :boom: ${totalRoundInflicted.teamRed.damage} :test_tube: ${totalRoundInflicted.teamRed.heal}\n`;
		if (Object.values(winner).length) {
			description = previousResult;
		}
		else {
			description = description + previousResult;
		}
	}
	const footer = Object.values(winner).length ? winner.msg : `Round: ${currentRound + 1}`;

	const minimalEmbed = new Discord.MessageEmbed()
		.setColor(sideColor)
		.setTitle(title)
		.setDescription(description)
		.setFooter(footer);

	return minimalEmbed;
};


const generateEmbedCombatRound = (progress) => {
	// shows minimal info
	if (progress.embedInformation.minimal) {
		return generateMinimalEmbed(progress);
	}
	const { title, description, fields, footer, teamRedName, teamGreenName } = progress.embedInformation;
	const { allowedWeapons } = progress.weaponInformation;
	const { teamRed, teamGreen, roundResults, currentRound, combatRules, originalGreenTeam, originalRedTeam, winner } = progress;

	const greenTeamsHp = getPlayersHp(teamGreen, originalGreenTeam);
	const redTeamsHp = getPlayersHp(teamRed, originalRedTeam, true);


	const teamGreenOverview = formatTeamOverview(teamGreen, originalGreenTeam);
	const teamRedOverview = formatTeamOverview(teamRed, originalRedTeam);

	const weaponsOverview = Object.keys(allowedWeapons).map(weapon => {
		// eslint-disable-next-line no-shadow
		const { answer, name, description } = allowedWeapons[weapon];
		return `${getIcon(name)} ${answer}) **${name}** ${description}\n`;
	});

	const topLeft = {
		name:  `${teamRedName} HP:`,
		value: redTeamsHp,
		inline: true,
	};
	const topRight = {
		name: `${teamGreenName} HP:`,
		value: greenTeamsHp,
		inline: true,
	};

	const midLeft = {
		name: teamRedName,
		value: teamRedOverview,
		inline: true,
	};
	const midRight = {
		name: teamGreenName,
		value: teamGreenOverview,
		inline: true,
	};
	const bottomLeft = {
		name: "Roundresults",
		value: [],
		inline: true,
	};

	const bottomRight = {
		name: "Choose your weapon!",
		value: weaponsOverview,
		inline: true,
	};
	const newLineSpace = {
		name: "\u200B",
		value: "\u200B",
		inline: false,
	};

	if (roundResults.length) {
		bottomLeft.value.push(`\n\`Results from round ${currentRound}:\``);
		bottomLeft.value.push(roundResults);
	}
	else {
		bottomLeft.value = "Get ready to fight!";
	}

	const combatFields = [
		topLeft,
		topRight,
		newLineSpace,
		midLeft,
		midRight,
		newLineSpace,
		bottomLeft,
	];
	// If a winner has been decided, no need for choosing a new weapon
	if (!Object.values(winner).length) {
		combatFields.push(bottomRight);
	}
	// Adds customized fields if they exist
	if (fields && fields.length) {
		combatFields.concat(fields);
	}

	let currentRoundTitle = title;
	switch (true) {
		case !!Object.values(winner).length:
			currentRoundTitle = winner.msg;
			break;
		case currentRound >= combatRules.maxRounds:
			currentRoundTitle = "";
			break;
		case currentRound + 1 === combatRules.maxRounds:
			currentRoundTitle += "\n Last Round";
			break;
		default:
			currentRoundTitle += `\n Round ${currentRound + 1 }`;
			break;
	}


	const embedResult = new Discord.MessageEmbed()
		.setTitle(currentRoundTitle)
		.setDescription(description)
		.setColor(sideColor)
		.addFields(...combatFields)
		.setFooter(Object.values(winner).length ? winner.msg : footer);
	return embedResult;
};

const getPlayersHp = (players, originalPlayers, teamRed = false) => {
	// embed get's messed up if hp bar is longer than 20
	const MAX_REPEATING = 20;
	const totalPlayerHealth = originalPlayers
		.reduce((acc, curr) => acc + curr.hero.health, 0);
	const totalPlayerCurrentHealth = players
		.reduce((acc, curr) => acc + curr.hero.currentHealth, 0);
	const percentageHealth = (totalPlayerCurrentHealth / totalPlayerHealth * 100) * MAX_REPEATING / 100;
	const percentageMissingHealth = MAX_REPEATING - percentageHealth;

	if (teamRed) {
		return `\`\`\`diff\n- ${"|".repeat(percentageHealth)}${" ".repeat(percentageMissingHealth)} \n \`\`\``;
	}
	return `\`\`\`diff\n+ ${"|".repeat(percentageHealth)}${" ".repeat(percentageMissingHealth)} \n \`\`\``;
};

const formatTeamOverview = (team, originalTeam)=>{
	const deadIcon = "☠️";
	const teamOverview = originalTeam
		.map(member=> {
			if (team.some(player=> player.account.username === member.account.username)) {
				return member.account.username;
			}
			else {
				return `${member.account.username} ${deadIcon}`;
			}
		});
	return teamOverview;
};


module.exports = { generateEmbedCombatRound, };