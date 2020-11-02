const Discord = require("discord.js");
const { getIcon } = require("../_CONSTS/icons");

const sideColor = "#45b6fe";

const createMinibossInvitation = (miniboss, user)=>{
	const { username } = user.account;
	const { currentLocation } = user.world;

	const rules = `\`Army allowed: ${getIcon(miniboss.combatRules.armyAllowed, "icon")}\`\n \`Helpers allowed: ${getIcon(miniboss.combatRules.helpersAllowed, "icon")}\`\n \`Max rounds: ${miniboss.combatRules.maxRounds}\`\n \`Attacks each round: ${miniboss.allowedNumOfAttacks}\``;
	const rewards = `${getIcon("gold")} \`Gold: ${miniboss.rewards.gold}\`\n ${getIcon("xp")} \`XP: ${miniboss.rewards.xp}\` \n ${getIcon(miniboss.rewards.dungeonKey)} \`Key: ${miniboss.rewards.dungeonKey}\``;

	const embedInvitation = new Discord.MessageEmbed()
		.setTitle(`A Miniboss has been triggered by ${username}!`)
		.setDescription(`Help to defeat ${getIcon("miniboss")} ${miniboss.name} from ${getIcon(currentLocation)} ${currentLocation} `)
		.setColor(sideColor)
		.addFields(
			{
				name: "Rules",
				value: rules,
				inline: true,
			},
			{
				name: `${miniboss.name}'s reward:`,
				value: rewards,
				inline: true,
			},
		)
		.setFooter(`React with a ${getIcon("miniboss", "icon")} within 20 seconds to participate! (max 10!)`);

	return embedInvitation;
};

/* const createMiniBossResultLoss = (rewards, combatResult) =>{
	const initiativeTaker = combatResult.originalGreenTeam[0];
	const initiativeTakerDamage = `-${rewards.damageDealt.initiativeTaker} HP`;

	const minibossIcon = getIcon("miniboss");
	const fields = [
		{
			name: `${initiativeTaker}`,
			value: initiativeTakerDamage,
			inline: false,
		},
	];
	if (rewards.helpers.length) {
		const helpersValue = rewards.helpers.map((h, i)=>`${h.account.username} - ${rewards.rewards.helpers[i].randomHelperDamage}hp ${rewards.rewards.helpers[i].helperDead ? "💀" : ""}\n\n`);
		fields.push({
			name: "Helpers damage",
			value: helpersValue,
			inline: false,
		});
	}

	const embedResult = new Discord.MessageEmbed()
		.setTitle(`${initiativeTaker} ${rewrads.helpers.length ? "and his helpers" : ""} failed to defeat ${minibossIcon} ${"minibossEvent.name"} `)
		.setDescription("Damage taken: ")
		.setColor(sideColor)
		.addFields(
			...fields,
		);

	return embedResult;

}; */


const createMinibossResult = (rewards, combatResult) => {
	const initiativeTaker = combatResult.originalGreenTeam[0];
	const initiativeTakerName = initiativeTaker.account.username;
	const miniboss = combatResult.originalRedTeam[0];

	let initiativeTakerRewards = `${getIcon("gold")} ${rewards.initiativeTaker.gold} | ${getIcon("xp")} ${rewards.initiativeTaker.xp}`;
	if (rewards.initiativeTaker.dungeonKey) {
		initiativeTakerRewards += `\n ${getIcon(rewards.initiativeTaker.dungeonKey)} ${rewards.initiativeTaker.dungeonKey} !`;
	}
	const minibossIcon = getIcon("miniboss");
	const fields = [
		{
			name: `${initiativeTakerName} rewards`,
			value: initiativeTakerRewards,
			inline: true,
		},
	];
	if (rewards.helpers.length) {
		fields.push({
			name: "Helpers rewards",
			value: rewards.helpers.map(helper=> `${helper.helperName}${helper.leveledUp ? " 💪" : ""} ${getIcon("gold")} ${helper.randomHelperGold} | ${getIcon("xp")} ${helper.randomHelperXp}`),
			inline: true,
		});
	}

	const embedResult = new Discord.MessageEmbed()
		.setTitle(`${initiativeTakerName} ${rewards.helpers.length ? "and his helpers" : ""} successfuly defeated ${minibossIcon} ${miniboss.account.username} `)
		.setDescription("Rewards will be distributed: ")
		.setColor(sideColor)
		.addFields(
			...fields,
		);
	return embedResult;
};


module.exports = { createMinibossInvitation, createMinibossResult };