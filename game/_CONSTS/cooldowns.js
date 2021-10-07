const Discord = require("discord.js");
const { msToHumanTime } = require("../_GLOBAL_HELPERS/index");

// in miliseconds
const cooldowns = {
	dailyPrize: (1000 * 60 * 60 * 24),
	duel: (1000 * 60 * 2),
	dungeon: (1000 * 60 * 3),
	explore: (1000 * 30),
	fish: (1000 * 15),
	hunt: (1000 * 20),
	miniboss: (1000 * 60 * 5),
	race: (1000 * 60 * 60 * 12),
	raid: (1000 * 60 * 2),
	tower: (1000 * 60 * 2),
	weeklyPrize: (1000 * 60 * 60 * 24 * 7),
};


/**
* function that could and should be used where ever there is need for cooldown
* @param {string} actionType - eg: "explore" or "miniboss"
* @param {Object} user - usermodel from mongodb
* @returns {Object} {
	response, Boolean,
	timeLeftInSec, String eg: "42"
	timeLeftInMs, String eg: "42069"
	timeLeftFormatted, String eg: "12h 49m 02s"
	message: String eg: "hunt is on cooldown! 42 seconds remaining until you can perform hunt",
	embed: Object Discord formatted response (pretty af)
}
*/

const onCooldown = (actionType, user) => {
	if (!actionType || !user) {
		console.error("Missing arguments ");
		return null;
	}
	if (!Object.keys(cooldowns).includes(actionType)) {
		console.error(`Cooldown for ${actionType} has not been configured`);
		return null;
	}
	const previousTime = user.cooldowns[actionType];
	const now = new Date();
	let cooldown = cooldowns[actionType];

	const patreonType = user.account.patreon;
	const patreonBonus = patreonType ? (cooldown * 0.15) : 0;

	cooldown -= patreonBonus;
	const timePassed = Math.abs(previousTime - now);

	if (timePassed < cooldown) {
		const timeLeftInMs = Math.ceil((cooldown - timePassed));
		const timeLeftInSec = (timeLeftInMs / 1000);
		const timeLeftFormatted = msToHumanTime(timeLeftInMs);

		return {
			response: true,
			timeLeftInSec,
			timeLeftInMs,
			timeLeftFormatted,
			message: `${actionType} is on cooldown! ${timeLeftInSec} seconds remaining until you can perform ${actionType}`,
			embed: generateSingleCdEmbed(timeLeftInMs, user),
		};
	}
	return {
		response: false,
	};

};

// generates a discord embed for when the user tries to perform an action that is in cooldown
const generateSingleCdEmbed = (timeLeftInMs, user) => {
	const timeLeftSentence = timeLeftInMs > 60000 ?
		`You can't use this command. Cooldown is ${msToHumanTime(timeLeftInMs)}`
		: `You can't use this command for ${Math.ceil(timeLeftInMs / 1000)} seconds`;

	const sideColor = "#45b6fe";
	const cardTitle = "Cooldown";
	const patreonInformation = user.account.patreon ?
		"Your cooldown is lowered due to your Patreon support"
		: "If you don't want to wait this much, you can help the bot in our [Patreon](https://www.patreon.com/megarpg), donators get some ingame benefits!";
	const cooldownEmbed = new Discord.MessageEmbed()
		.setTitle(cardTitle)
		.setColor(sideColor)
		.addFields(
			{
				name: timeLeftSentence,
				value: patreonInformation,
				inline: true,
			},
		);
	return cooldownEmbed;
};

// generates a discord embed with all the active cooldowns a user have
const generateAllCdEmbed = (user) => {
	const { username } = user.account;
	const cooldownNames = Object.keys(cooldowns);
	const allOnCoolDowns = cooldownNames.map(c => {
		const info = onCooldown(c, user);
		return info.response ? info.timeLeftInMs : false;
	});

	const status = allOnCoolDowns
		.map((c, i) => {
			const formattedName = `${"`"} ${cooldownNames[i][0].toUpperCase() + cooldownNames[i].slice(1)} ${"`"}`;
			if (!c) {
				return `✅ ~-~ ${formattedName}`;
			}
			return `🕘 ~-~ ${formattedName} **(${msToHumanTime(c)})**`;
		});

	const sideColor = "#45b6fe";
	const allCooldownsEmbed = new Discord.MessageEmbed()
		.setTitle(`${username}'s cooldowns`)
		.setColor(sideColor)
		.addFields(
			{
				name: "Current status",
				value: status,
				inline: false,
			},
		);
	return allCooldownsEmbed;
};


module.exports = { onCooldown, generateSingleCdEmbed, generateAllCdEmbed };