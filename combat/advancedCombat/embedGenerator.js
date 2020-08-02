const Discord = require("discord.js");
const { getIcon } = require("../../game/_CONSTS/icons");


const generateEmbedCombatRound = (progress) => {
	const { allowedWeapons } = progress.weaponInformation;
	const { teamRed, teamGreen, roundResults, allDiscordIds, allPlayerNames } = progress;
	const { title, description, fields, footer } = progress.embedInformation;

	const greenTeamsHp = getPlayersHp(teamGreen, allDiscordIds);
	const redTeamsHp = getPlayersHp(teamRed, allDiscordIds, true);

	const teamRedOVerview = formatTeamOverview(teamRed, allPlayerNames);
	const teamGreenOverview = formatTeamOverview(teamGreen, allPlayerNames);

	const weaponsOverview = Object.keys(allowedWeapons).map(w => {
		// eslint-disable-next-line no-shadow
		const { answer, name, description } = allowedWeapons[w];
		return `${getIcon(name)} ${answer}) **${name}** ${description}\n`;
	});

	const topLeft = {
		name:  "Team Red HP:",
		value: redTeamsHp,
		inline: true,
	};
	const topRight = {
		name: "Team Green HP:",
		value: greenTeamsHp,
		inline: true,
	};

	const midLeft = {
		name: "Team Red",
		value: teamRedOVerview,
		inline: true,
	};
	const midRight = {
		name: "Team Red",
		value: teamGreenOverview,
		inline: true,
	};
	const bottomLeft = {
		name: "Roundresults",
		value: "Get ready to fight",
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
		.filter(p => currentDiscordIds.has(p.account.username))
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