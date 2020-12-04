const { getIcon } = require("../_CONSTS/icons");
const { createMinibossInvitation, createMinibossResult } = require("./embedGenerator");
const { createCombatRound } = require("../../combat/advancedCombat");
const { minibossStartAllowed, createMinibossEvent, setupProgress, validateHelper, generateRewards, giveRewards } = require("./helper");
const User = require("../../models/User");

const handleMiniboss = async (message, user) => {

	const disallowed = minibossStartAllowed(user);
	if (disallowed) {
		return message.channel.send(disallowed);
	}
	const miniboss = createMinibossEvent(user);
	const now = new Date();
	user.setNewCooldown("miniboss", now);
	await user.save();

	const minibossInvitation = createMinibossInvitation(miniboss, user);
	const invitation = await message.channel.send(minibossInvitation);
	const minibossIcon = getIcon("miniboss", "icon");
	const progress = setupProgress(miniboss, user);
	await invitation.react(minibossIcon);

	const reactionFilter = (reaction) => reaction.emoji.name === minibossIcon;

	const collector = await invitation.createReactionCollector(reactionFilter, { max: 10, time: 1000 * 20, errors: ["time"] });
	collector.on("collect", async (result, rUser) => {
		if (rUser.bot) {
			return;
		}
		if (progress.teamGreen.length > 9) {
			return collector.stop();
		}
		const helper = await User.findOne({ "account.userId": rUser.id });

		const disallowedHelper = validateHelper(progress, helper, rUser.id);
		if (disallowedHelper) {
			return message.channel.send(`<@${message.author.id}>: ${disallowedHelper}`);
		}
		progress.teamGreen.push(helper);
	});

	collector.on("end", async () => {
		const combatResult = await createCombatRound(message, progress);
		if (combatResult.winner.victory === "green") {
			const rewards = generateRewards(combatResult);
			await giveRewards(rewards, combatResult);
			const embed = createMinibossResult(rewards, combatResult);
			message.channel.send(embed);
		}
	});
};

module.exports = { handleMiniboss };