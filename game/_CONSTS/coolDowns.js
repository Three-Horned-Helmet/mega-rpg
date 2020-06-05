const Discord = require("discord.js");

// in miliseconds
const cooldowns = {
	explore: (1000 * 30),
};

const onCooldown = (actionType, previousTime, user)=>{
	if (!actionType || !previousTime || !user) {
		console.error("Missing arguments ");
		return;
	}
	if (!Object.keys(cooldowns).includes(actionType)) {
		console.error(`Cooldown for ${actionType} has not been configured`);
		return;
	}
	const now = new Date();
	const timePassed = Math.abs(previousTime - now);

	if (timePassed < cooldowns[actionType]) {
		const timeLeft = Math.ceil((cooldowns[actionType] - timePassed) / 1000);
		return {
			response:true,
			timeLeft,
			message: `${actionType} is on cooldown! ${timeLeft} seconds remaining until you can perform ${actionType}`,
			embed: generateSingleCdEmbed(timeLeft, user),
		};
	}
	return {
		response:false,
	};

};

const generateSingleCdEmbed = (timeLeft, user) =>{
	// todo: format time so > 60 seconds turns 1m 00s
	// todo: maybe add actiontype to embed
	const sideColor = "#45b6fe";
	const cardTitle = "Cooldown";
	const timeLeftSentence = `You can't use this command for ${timeLeft} seconds`;
	const patreonInformation = user.account.patreon ?
		"Your cooldown is lowered due to your Patreon support"
		: "If you don't want to wait this much, you can help the bot in our [Patreon](https://www.patreon.com), donators get some ingame benefits!";
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

// todo, create a cooldown command that returns all active cooldowns
/* const generateAllCdEmbed = ()=>{
	return;
}; */


module.exports = { onCooldown };