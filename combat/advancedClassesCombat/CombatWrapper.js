const Discord = require("discord.js");
const User = require("../../models/User");
const { GameEngine } = require("@three-horned-helmet/combat-system-mega-rpg");
const { CombatMessageAPI } = require("./CombatMessageAPI");
const { asyncForEach } = require("../../game/_GLOBAL_HELPERS");
const { getIcon } = require("../../game/_CONSTS/icons");

/*
const options = {
	maxRounds: Number,
	armyAllowed: Boolean,
	helpersAllowed: Boolean,
	isPVP: Boolean,
	isPVPs: Boolean
} */

class CombatWrapper {
	constructor(data) {
		if (!data.user || !data.nameOfClass || !data.message || !data.options) {
			throw new Error(
				"Cannot create an instance without user, nameOfClass, Discord Message or options"
			);
		}
		this.messageAPI = new CombatMessageAPI(data.message);
		this.user = data.user;
		this.nameOfClass = data.nameOfClass;
		this.options = data.options;
		this.game;
		this.greenTeam = [];
		this.redTeam = [];
		this.combatCanStart = true;
		this.now = new Date();
	}
	async startCombat() {
		await this.setupCombat();
		if (!this.combatCanStart) {
			return;
		}
		await this.game.startGame();
	}
	async setupCombat() {
		if (this.combatInvitationsAllowed) {
			await this.handleCombatInvitation();
		}
		this.checkCombatAllowed();
		this.game = new GameEngine(this.messageAPI, this.greenTeam, this.redTeam, this.options);
	}
	checkCombatAllowed() {
		if (!this.greenTeam.length) {
			return this.errorHandler("Missing team one");
		}
		if (!this.redTeam.length) {
			return this.errorHandler("Missing team two");
		}
	}
	addGreenTeam(unit) {
		console.log("adding unit to team one");
		Array.isArray(unit) ? this.greenTeam.push(...unit) : this.greenTeam.push(unit);
	}
	addRedTeam(unit) {
		console.log("adding unit to team two");
		Array.isArray(unit) ? this.redTeam.push(...unit) : this.redTeam.push(unit);
	}
	convertWorldUnitToNpc(worldUnit) {
		// DEFENSE? todo
		// classname
		const { name, stats } = worldUnit;
		return {
			_id: Math.random().toString(),
			isNpc: true,
			account: {
				username: name
			},
			hero: {
				rank: 3,
				health: stats.health,
				currentHealth: stats.health,
				attack: stats.attack,
				defense: stats.attack,
				className: "Mage"
			}
		};
	}
	convertArmyToNpc(user) {
		// todo classname
		// todo balance this unit (with armory)
		const { units, armory } = user.army;
		return {
			_id: Math.random().toString(),
			isNpc: true,
			account: {
				username: `${user.account.username}'s army'`
			},
			hero: {
				rank: 3,
				health: 200,
				currentHealth: 200,
				attack: 30,
				defense: 30,
				className: "Mage"
			}
		};
	}
	convertNpcToArmy(npc, user) {
		// TODO calculate loss of health and remove percentage of units
		console.log("converting to army");
	}
	errorHandler(error) {
		console.error("ERROR: ", error);
		this.combatCanStart = false;
		this.messageAPI.sendMessage(error);
	}

	async handleCombatInvitation() {

		const getCombatIcons = () => ["🟢", "🔴"]; // should be 3

		const icons = getCombatIcons();


		const invitation = await message.channel.send(createEmbedInvitation(this));
		const reactionIcon = getIcon("place", "icon");

		const reactionFilter = (reaction) => icons.includes(reaction.emoji.name);

		await asyncForEach((icons), async (r)=>{
			raceInvitation.react(r);
		});

		const collector = await invitation.createReactionCollector(reactionFilter, { time: 1000 * 20, errors: ["time"] });

		collector.on("collect", async (result, reactedUser) => {
			const user = await User.findOne({ "account.userId": reactedUser.id }).lean();
			// todo,
			// is not reactedUser.bot
			// team is not too big
			// user has health
			// user is not in any team team
			// addGreenTeam
			this.addGreenTeam(user);
		});

		collector.on("end", async () => {
			// await startgame?
		});


	}
}
module.exports = CombatWrapper;


const createEmbedInvitation = (place, user) => {


	const sideColor = "#45b6fe";
	const { username } = user.account;
	const placeIcon = getIcon("place");
	const rules = `\` ${place.rooms.length} Rooms\`\n ${getIcon(place.boss.rules.canKill)} \`place deadly\`\n${getIcon(place.boss.rules.allowHelpers, "icon")} \`helpers allowed\`\n\n**Unclocks**: ${getIcon(place.boss.unlocks)} **${place.boss.unlocks}**\n`;
	const stats = `${getIcon("health")} \`Health: ${place.boss.stats.health}\`\n ${getIcon("attack")} \`Attack: ${place.boss.stats.attack}\`\n ${getIcon(place.boss.stats.healing)} \`Healing\`\n`;
	const rewards = `${getIcon("gold")} \`Gold: ${place.boss.rewards.gold}\`\n ${getIcon("xp")} \`XP: ${place.boss.rewards.xp}\`\n${getIcon(!!place.boss.rewards.drop.length)} \`Loot drop\`\n\n   `;
	const bossWeapons = place.boss.bossWeapons.map(w => `${getIcon(w)} \`${w}\``);

	const fields = [{
		name: `${place.boss.name}'s Boss stats:`,
		value: stats,
		inline: true,
	},
	{
		name: `${place.boss.name}'s weapons:`,
		value: bossWeapons,
		inline: true,
	},

	{
		name: "\u200B",
		value: "\u200B",
		inline: false,
	},
	{
		name: "Rules",
		value: rules,
		inline: true,
	},

	{
		name: `${place.boss.name}'s rewards:`,
		value: rewards,
		inline: true,
	}];

	const embedInvitation = new Discord.MessageEmbed()
		.setTitle(`${username} is going for the place !!`)
		.setDescription(`Help taking out ${placeIcon} **${place.boss.name}** in ${place.name}!`)
		.setColor(sideColor)
		.addFields(
			...fields,
		)
		.setFooter(`React with a ${getIcon("place", "icon")} within 20 seconds to participate! (max 5!)`);
	return embedInvitation;

};