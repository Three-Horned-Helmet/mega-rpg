const Discord = require("discord.js");
const { getIcon } = require("../../game/_CONSTS/icons");


const generateEmbedCombatRound = (progress) => {
	const { allowedWeapons } = progress.weaponInformation;
	const { teamRed, teamGreen, roundResults, teamGreenIds, teamRedIds, teamGreenNames, teamRedNames, combatRules } = progress;
	const { title, description, fields, footer } = progress.embedInformation;

	const greenTeamsHp = getPlayersHp(teamGreen, teamGreenIds);
	let redTeamsHp;

	if (combatRules.mode === "PVP") {
		redTeamsHp = getPlayersHp(teamRed, teamRedIds, true);
	}
	if (combatRules.mode === "PVE") {
		redTeamsHp = getNpcHp(teamRed);
	}
	const teamGreenOverview = formatTeamOverview(teamGreen, teamGreenNames);
	const teamRedOverview = formatTeamOverview(teamRed, teamRedNames);

	const weaponsOverview = Object.keys(allowedWeapons).map(w => {
		// eslint-disable-next-line no-shadow
		const { answer, name, description } = allowedWeapons[w];
		return `${getIcon(name)} ${answer}) **${name}** ${description}\n`;
	});

	const teamGreenName = progress.embedInformation.teamGreen ? progress.embedInformation.teamGreen : teamGreen.length !== 1 ? "Team Green" : teamGreen[0].account.username;
	const teamRedName = progress.embedInformation.teamRed ? progress.embedInformation.teamRed : teamRed.length !== 1 ? "Team Red" : teamRed[0].name || teamRed[0].account.username;

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

	if (roundResults.length) {
		bottomLeft.value.push("\n");
		bottomLeft.value.push(`\`Results from round ${progress.currentRound}:\``);
		bottomLeft.value.push(roundResults);
	}
	else {
		bottomLeft.value = "Get ready to fight";
	}

	const sideColor = "#45b6fe";
	const combatFields = [
		topLeft,
		topRight,
		{
			name: "\u200B",
			value: "\u200B",
			inline: false,
		},
		midLeft,
		midRight,
		{
			name: "\u200B",
			value: "\u200B",
			inline: false,
		},
		bottomLeft,
		bottomRight
	];
	if (fields.length) {
		combatFields.concat(fields);
	}

	const embedResult = new Discord.MessageEmbed()
		.setTitle(`${title || "BATTLE!"} \nround ${progress.currentRound + 1}`)
		.setDescription(description)
		.setColor(sideColor)
		.addFields(
			...combatFields,
		)
		.setFooter(footer || "TIP: Write your weapon of choice in the chat. eg -> a or c");
	return embedResult;
};


const getPlayersHp = (players, currentDiscordIds, teamRed = false) => {
	// embed get's messed up if hp bar is longer than 20
	const MAX_REPEATING = 20;
	const totalPlayerHealth = players
		.reduce((acc, curr) => acc + curr.hero.health, 0);
	const totalPlayerCurrentHealth = players
		.filter(p => currentDiscordIds.includes(p.account.userId))
		.reduce((acc, curr) => acc + curr.hero.currentHealth, 0);
	const percentageHealth = (totalPlayerCurrentHealth / totalPlayerHealth * 100) * MAX_REPEATING / 100;
	const percentageMissingHealth = MAX_REPEATING - percentageHealth;

	if (teamRed) {
		return `\`\`\`diff\n- ${"|".repeat(percentageHealth)}${" ".repeat(percentageMissingHealth)} \n \`\`\``;
	}
	return `\`\`\`diff\n+ ${"|".repeat(percentageHealth)}${" ".repeat(percentageMissingHealth)} \n \`\`\``;
};

const getNpcHp = (teamRed) => {
	const MAX_REPEATING = 20;
	const totalNpcHealth = teamRed
		.reduce((acc, curr) => acc + curr.stats.maxHealth, 0);
	const totalNpcCurrentHealth = teamRed
		.reduce((acc, curr) => acc + curr.stats.health, 0);
	const percentageHealth = (totalNpcCurrentHealth / totalNpcHealth * 100) * MAX_REPEATING / 100;
	const percentageMissingHealth = MAX_REPEATING - percentageHealth;

	console.log(totalNpcCurrentHealth, totalNpcHealth);

	return `\`\`\`diff\n- ${"|".repeat(percentageHealth)}${" ".repeat(percentageMissingHealth)} \n \`\`\``;
};

const formatTeamOverview = (team, allPlayers)=>{
	if (allPlayers.length === 1) {
		return "1 man army";
	}
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