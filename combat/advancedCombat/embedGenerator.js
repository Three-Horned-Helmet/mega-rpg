const Discord = require("discord.js");
const { getIcon } = require("../../game/_CONSTS/icons");


const generateEmbedCombatRound = (progress) => {
	const { allowedWeapons } = progress.weaponInformation;
	const { teamRed, teamGreen, roundResults, teamGreenIds, teamRedIds, teamGreenNames, teamRedNames, currentRound, combatRules } = progress;
	const { title, description, fields, footer, teamRedName, teamGreenName } = progress.embedInformation;

	const greenTeamsHp = getPlayersHp(teamGreen, teamGreenIds);
	const redTeamsHp = getPlayersHp(teamRed, teamRedIds, true);

	const teamGreenOverview = formatTeamOverview(teamGreen, teamGreenNames);
	const teamRedOverview = formatTeamOverview(teamRed, teamRedNames);

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

	const sideColor = "#45b6fe";
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
	if (!Object.values(progress.winner).length) {
		combatFields.push(bottomRight);
	}
	// Adds customized fields if they exist
	if (fields && fields.length) {
		combatFields.concat(fields);
	}

	let currentRoundTitle = title;
	switch (true) {
		case Object.values(progress.winner).length:
			currentRoundTitle = progress.winner.msg;
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
		.setFooter(Object.values(progress.winner).length ? progress.winner.msg : footer);
	return embedResult;
};

const getPlayersHp = (players, currentDiscordIds, teamRed = false) => {
	// embed get's messed up if hp bar is longer than 20
	const MAX_REPEATING = 20;
	const totalPlayerHealth = players
		.reduce((acc, curr) => acc + curr.hero.health, 0);
	const totalPlayerCurrentHealth = players
		.filter(player => currentDiscordIds.includes(player.account.userId))
		.reduce((acc, curr) => acc + curr.hero.currentHealth, 0);
	const percentageHealth = (totalPlayerCurrentHealth / totalPlayerHealth * 100) * MAX_REPEATING / 100;
	const percentageMissingHealth = MAX_REPEATING - percentageHealth;

	if (teamRed) {
		return `\`\`\`diff\n- ${"|".repeat(percentageHealth)}${" ".repeat(percentageMissingHealth)} \n \`\`\``;
	}
	return `\`\`\`diff\n+ ${"|".repeat(percentageHealth)}${" ".repeat(percentageMissingHealth)} \n \`\`\``;
};

const formatTeamOverview = (team, allPlayers)=>{
	const deadIcon = "☠️";
	const teamOverview = Array
		.from(allPlayers)
		.map(member=> {
			if (team.some(player=> player.account.username === member)) {
				return member;
			}
			else {
				return `${member} ${deadIcon}`;
			}
		});
	return teamOverview;
};


module.exports = { generateEmbedCombatRound, };