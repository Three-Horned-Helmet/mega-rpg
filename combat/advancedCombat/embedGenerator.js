const Discord = require("discord.js");
const { getIcon } = require("../../game/_CONSTS/icons");


const generateEmbedCombatRound = (progress) => {
//	console.log(progress);
	const { allowedWeapons } = progress.weaponInformation;
	const { teamRed, teamGreen, roundResults } = progress;
	// const initiativeTakerName = progress.initiativeTaker.account.username;

	const topLeft = {
		name:  "Team Red HP:",
		value: null,
		inline: true,
	};
	const topRight = {
		name: "Team Green HP:",
		value: null,
		inline: true,
	};

	const bottomLeft = {
		name: "Team Red",
		value: null,
		inline: true,
	};
	const bottomRight = {
		name: "Team Red",
		value: null,
		inline: true,
	};

	/* 	const bottomLeft = progress.players.length > 1 ?
		progress.players
			.filter(p => p.account.username !== initiativeTakerName)
			.map(p => `${p.account.username} ${p.hero.currentHealth <= 0 ? "☠️" : ""} `)
		: ["You're fighting solo!"]; */

	if (roundResults.length) {
		bottomLeft.push("\n");
		bottomLeft.push(`\`Results from round ${progress.bossAttempts}:\``);
		bottomLeft.push(roundResults);
	}
	const dungeonName = progress.dungeon.name;
	const dungeonIcon = getIcon("dungeon");

	const bossName = progress.dungeon.boss.name;
	const dungeonHp = getDungeonHp(progress.dungeon.boss.stats);
	const playersHp = getPlayersHp(progress.players, progress.dungeon.helperIds);

	const weaponsTitle = "Choose your weapon:";
	const weaponsOverview = Object.keys(allowedWeapons).map(w => {
		const { answer, name, description } = allowedWeapons[w];
		return `${getIcon(name)} ${answer}) **${name}** ${description}\n`;
	});
	const title = `${dungeonIcon} ${dungeonName}  ~~~  BOSS FIGHT \nround ${progress.bossAttempts + 1}`;
	const sideColor = "#45b6fe";
	const description = progress.dungeon.boss.roundDescriptions[progress.bossAttempts];
	const footer = "TIP: Write your weapon of choice in the chat. eg -> a or c";
	const fields = [
		{
			name: `${bossName} HP:`,
			value: dungeonHp,
			inline: true,
		},
		{
			name: `${initiativeTakerName}'s gang total HP:`,
			value: playersHp,
			inline: true,
		},
		{
			name: "\u200B",
			value: "\u200B",
			inline: false,
		},
		{
			name: `${initiativeTakerName}'s gang:`,
			value: bottomLeft,
			inline: true,
		},
		{
			name: `${weaponsTitle}`,
			value: weaponsOverview,
			inline: true,
		},
	];

	const embedResult = new Discord.MessageEmbed()
		.setTitle(title)
		.setDescription(description)
		.setColor(sideColor)
		.addFields(
			...fields,
		)
		.setFooter(footer);
	return embedResult;
};


const generateEmbedCombatResult = (progress) => {
	return progress.win ? createDungeonBossResultWin(progress) : createDungeonBossResultLoss(progress);
};

const createDungeonBossResultWin = (progress) => {
	const sideColor = "#45b6fe";

	const topLeft = progress.teamRed
		.map(p => `${p.account.username} ${p.hero.currentHealth <= 0 ? "☠️" : ""} `);

	const { roundResults } = progress;
	if (roundResults.length) {
		topLeft.push("\n");
		topLeft.push("`Results from last round:`");
		topLeft.push(`\n ☠️ ☠️ ${bossName} ☠️ ☠️ `);
		topLeft.push(roundResults);
	}

	const rewards = [];

	if (initiativeTakerAlive) {
		rewards.push(`${initiativeTakerName}\n ${getIcon("gold")} Gold: ${progress.rewards.initiativeTaker.gold}\n ${getIcon("xp")}Xp: ${progress.rewards.initiativeTaker.xp} \n 🎲Drop: ${progress.rewards.initiativeTaker.drop}`);
	}
	if (progress.rewards.helperIds.length) {
		progress.rewards.helperIds.forEach(r => {
			rewards.push(`${r.name}\n ${getIcon("gold")} Gold: ${r.gold}\n ${getIcon("xp")}Xp: ${r.xp} \n 🎲Drop: ${r.drop}`);
		});
	}

	const fields = [
		{
			name: `${initiativeTakerName}'s gang:`,
			value: topLeft,
			inline: true,
		},
		{
			name: "Rewards",
			value: rewards,
			inline: true,
		},
	];


	const title = `${bossName} defeated!`;

	const unlockedLocation = progress.dungeon.boss.unlocks;
	const locationIcon = getIcon(unlockedLocation);
	let description = `${initiativeTakerName} `;
	if (initiativeTakerAlive) {
		description += `has unlocked ${locationIcon} ${unlockedLocation}`;
	}
	else {
		description += "died trying to fight the boss";
	}

	const embedResult = new Discord.MessageEmbed()
		.setTitle(title)
		.setDescription(description)
		.setColor(sideColor)
		.addFields(
			...fields,
		);
	return embedResult;
};


const createDungeonBossResultLoss = (progress) => {

	const initiativeTakerName = progress.initiativeTaker.account.username;
	const sideColor = "#45b6fe";

	const bottomLeft = progress.players
		.filter(p => p.account.username !== initiativeTakerName)
		.map(p => `${p.account.username} ${p.hero.currentHealth <= 0 ? "☠️" : ""} `);

	const { roundResults } = progress;
	if (roundResults.length) {
		bottomLeft.push("\n");
		bottomLeft.push("`Results from last round:`");
		bottomLeft.push(roundResults);
	}

	const fields = [
		{
			name: `${initiativeTakerName}'s gang:`,
			value: bottomLeft,
			inline: false,
		},
	];


	const bossName = progress.dungeon.boss.name;
	const title = `${bossName} defeated ${initiativeTakerName}!`;

	const description = `${initiativeTakerName} did **not** unlock a new world`;

	const embedResult = new Discord.MessageEmbed()
		.setTitle(title)
		.setDescription(description)
		.setColor(sideColor)
		.addFields(
			...fields,
		);
	return embedResult;
};

const getPlayersHp = (players, currentDiscordIds) => {
	// embed get's messed up if hp bar is longer than 20
	const MAX_REPEATING = 20;
	const totalPlayerHealth = players
		.reduce((acc, curr) => acc + curr.hero.health, 0);
	const totalPlayerCurrentHealth = players
		.filter(p => currentDiscordIds.includes(p.account.userId))
		.reduce((acc, curr) => acc + curr.hero.currentHealth, 0);
	const percentageHealth = (totalPlayerCurrentHealth / totalPlayerHealth * 100) * MAX_REPEATING / 100;
	const percentageMissingHealth = MAX_REPEATING - percentageHealth;

	return `\`\`\`diff\n+ ${"|".repeat(percentageHealth)}${" ".repeat(percentageMissingHealth)} \n \`\`\``;
};
const getDungeonHp = (stats) => {
	const MAX_REPEATING = 20;
	const percentageHealth = (stats.currentHealth / stats.health * 100) * MAX_REPEATING / 100;
	const percentageMissingHealth = MAX_REPEATING - percentageHealth;

	return `\`\`\`diff\n- ${"|".repeat(percentageHealth)}${" ".repeat(percentageMissingHealth)} \n \`\`\``;
};


function generateRoomEmbed(user, placeInfo, results, questIntro = false) {
	const sideColor = "#45b6fe";
	const placeName = placeInfo.name;
	const placeIcon = getIcon(placeInfo.type);


	const fields = results.map(result => {
		const casualtiesPercentage = (result.lossPercentage * 100).toFixed(2);
		const rewards = Object.keys(result.resourceReward).map(r => {
			return `${getIcon(r)} ${r}: **${result.resourceReward[r]}**`;
		});
		rewards.push(`\n+ **${result.expReward}** xp`);
		rewards.push(`Casulty: **${casualtiesPercentage}**% \n`);

		let { username } = result;
		if (result.levelUp) {
			username += " 💪 ";
		}
		if (!result.win) {
			username += " ☠️ ";
		}
		return {
			name: username,
			value: rewards,
			inline: true,
		};
	});

	if (questIntro) {
		fields.push({
			name: `${getIcon("quest")}Quest${getIcon("quest")}`,
			value: questIntro,
		});
	}

	const title = `${user.account.username}'s entourage raided ${placeIcon} ${placeName}`;

	const embedWin = new Discord.MessageEmbed()
		.setTitle(title)
		.setColor(sideColor)
		.addFields(
			...fields,
		)
		.setFooter(`Proceed? ${getIcon(false, "icon")} / ${getIcon(true, "icon")}`);
	return embedWin;
}

const generateRoomDescriptionEmbed = (progress, placeInfo, dots) => {
	const sideColor = "#45b6fe";
	const placeName = placeInfo.name;
	const placeIcon = getIcon(placeInfo.type);

	const fields = [{
		name: `${placeIcon} ${placeName}`,
		value: `${placeInfo.description}${".".repeat(dots)}`,
		inline: true,
	}];

	const embedWin = new Discord.MessageEmbed()
		.setColor(sideColor)
		.addFields(
			...fields,
		);
	return embedWin;
};


module.exports = { createDungeonInvitation, generateEmbedCombatRound, generateEmbedCombatResult, generateRoomEmbed, generateRoomDescriptionEmbed };