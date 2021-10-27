const Discord = require("discord.js");
const combatConstants = require("../../game/_CONSTS/combat.json")

class CombatMessageAPI {
    constructor(message, options = {}) {
        this.message = message
        this.options = options
        this.game = null

        this.defaultSideColor = "#45b6fe"
        this.previousAbilityResponse = []
        this.effectMessages = []
        this.deathMessages = []
        this.round = 1
    }

    // Options: { withTeam: Boolean }. 
    genericPrefightRuleGenerator = async () => {
        const { withTeam } = this.options
        // const disallowed = minibossStartAllowed(user);
        // if (disallowed) {
        //     return message.channel.send(disallowed);
        // }
        // const now = new Date();
        // user.setNewCooldown("miniboss", now);
        // await user.save();

        if(withTeam){
            // // Handle invitations here
            // const invitationEmbed = _invitationEmbed(teamOne, teamTwo);
            // const invitation = await message.channel.send(invitationEmbed);
            // await invitation.react(minibossIcon);
            // const reactionFilter = (reaction) => reaction.emoji.name === minibossIcon;
            // const collector = await invitation.createReactionCollector(reactionFilter, { max: 10, time: 1000 * 20, errors: ["time"] });
            // collector.on("collect", async (result, rUser) => {
            //     if (rUser.bot) {
            //         return;
            //     }
            //     if (progress.teamGreen.length > 9) {
            //         return collector.stop();
            //     }
            //     const helper = await User.findOne({ "account.userId": rUser.id });
        
            //     const disallowedHelper = validateHelper(progress, helper, rUser.id);
            //     if (disallowedHelper) {
            //         return message.channel.send(`<@${message.author.id}>: ${disallowedHelper}`);
            //     }
            //     progress.teamGreen.push(helper);
            // });
        
            // collector.on("end", async () => {
            //     const combatResult = await createCombatRound(message, progress);
            //     if (combatResult.winner.victory === "green") {
            //         const rewards = generateRewards(combatResult);
            //         await giveRewards(rewards, combatResult);
            //         const embed = createMinibossResult(rewards, combatResult);
            //         message.channel.send(embed);
            //     }
            // });
        }
        const rulesEmbed = this._fightDetailsEmbed()
        const invitation = await this.message.channel.send(rulesEmbed);

    }

    pickAbilityMessage = async (player, abilities) => {
        const playerName = player.name
        const allLetters = "abcefghijklmnopqrstuvwxyz".split("")
        const capitalizeFirstLetter = (string) => {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }
        const abilitiesString = `__${playerName}:__ Can pick from abilities: \n ${abilities.map((a, i) => `${allLetters[i]}) ${capitalizeFirstLetter(a.constants.name)} \n ${a.constants.description}`).join("\n \n")}`

        const abilityPickerEmbed = this._abilityPickerEmbed(player, abilitiesString)
        await this.message.channel.send(abilityPickerEmbed)

        const filter = (response) => {
            // checks if person included included in the fight
            return player.id === response.author.id;
        };

        const collector = await this.message.channel.createMessageCollector(filter, {
            time: combatConstants.messageAPI.defaultCombatReactTime,
            errors: ["time"],
        });

        let pickedAbility;
        collector.on("collect", async (result) => {
            if (result.author.bot) {
                return;
            }

            const chosenAbilityIndex = allLetters.indexOf(result.content[0]?.toLowerCase())
            if(chosenAbilityIndex < 0) return
            pickedAbility = abilities[chosenAbilityIndex]
            if(!pickedAbility) return

            // stops collecting if all humans have answered
            // await sleep(1500);
            collector.stop();
        });

        // TODO: Error handling (on timeout)
        return await new Promise ((resolve) => {
            collector.on("end", async () => {
                resolve(pickedAbility)
            });
        });
    }

    deathMessage = async (players = []) => {
        this.deathMessages = this.deathMessages.concat(players)
        // players.forEach((player) => {
        //     this.deathMessages.push(player)
        // })
    }

    effectMessage = async (message) => {
        this.effectMessages.push(message)
        // return console.log(message)
    }

    abilityMessage = async (abilityResponse) => {
        this.previousAbilityResponse.push(abilityResponse)
        // return console.log(abilityResponse)
    }

    newRoundMessage = async (round) => {
        this.round = round
        // return console.log("New round: " + round)
    }

    endGameMessage = async (winningTeam) => {
        const extraFields = (fields) => {
            this._endGameExtraFieldsEmbed(winningTeam, fields)
        }
        const lastCombatTurnEmbed = this._abilityPickerEmbed(winningTeam[0], null, extraFields)
        await this.message.channel.send(lastCombatTurnEmbed)
        // return process.exit()
    }




    _invitationEmbed = (miniboss, user) => {
        // const { username } = user.account;
        // const { currentLocation } = user.world;

        // const rules = `\`Army allowed: ${getIcon(options.allowFriends, "icon")}\`\n \`Helpers allowed: ${getIcon(miniboss.combatRules.helpersAllowed, "icon")}\`\n \`Max rounds: ${miniboss.combatRules.maxRounds}\`\n \`Attacks each round: ${miniboss.allowedNumOfAttacks}\``;
        // const rewards = `${getIcon("gold")} \`Gold: ${miniboss.rewards.gold}\`\n ${getIcon("xp")} \`XP: ${miniboss.rewards.xp}\` \n ${getIcon(miniboss.rewards.dungeonKey)} \`Key: ${miniboss.rewards.dungeonKey}\``;

        // const embedInvitation = new Discord.MessageEmbed()
        //     .setTitle(`A Miniboss has been triggered by ${username}!`)
        //     .setDescription(`Help to defeat ${getIcon("miniboss")} ${miniboss.name} from ${getIcon(currentLocation)} ${currentLocation} `)
        //     .setColor(sideColor)
        //     .addFields(
        //         {
        //             name: "Rules",
        //             value: rules,
        //             inline: true,
        //         },
        //         {
        //             name: `${miniboss.name}'s reward:`,
        //             value: rewards,
        //             inline: true,
        //         },
        //     )
        //     .setFooter(`React with a ${getIcon("miniboss", "icon")} within 20 seconds to participate! (max 10!)`);

        // return embedInvitation;
    }

    _getName = player => {
        return player.name || player?.account.username || "npc"
    }

    _displayPlayerHp = (player) => {
        // embed get's messed up if hp bar is longer than 20
        const MAX_REPEATING = 20;
        const { health, currentHealth } = player;
        let percentageHealth = Math.floor((currentHealth / health * 100) * MAX_REPEATING / 100);
        let percentageMissingHealth = Math.floor(MAX_REPEATING - percentageHealth);
        if(percentageHealth < 0) percentageHealth = 0
        if(percentageMissingHealth < 0) percentageMissingHealth = 0
        
        if (player.team === 2) {
            return `\`\`\`diff\n- ${"|".repeat(percentageHealth)}${" ".repeat(percentageMissingHealth)} \n \`\`\``;
        }
        return `\`\`\`diff\n+ ${"|".repeat(percentageHealth)}${" ".repeat(percentageMissingHealth)} \n \`\`\``;
    };

    _fightDetailsEmbed = () => {
        const { title, description, sideColor, rewards } = this.options
        const namesTeamOne = this.game.originalTeamOne.map(this._getName)
        const namesTeamTwo = this.game.originalTeamTwo.map(this._getName)

        // const extraFields = []

        // if(rewards) {

        // }

        const fightDetailsEmbed = new Discord.MessageEmbed()
            .setTitle(title || "A fight has been initiated!")
            .setDescription(description || "Prepare for fight!")
            .setColor(sideColor || this.defaultSideColor)
            .addFields(
                {
                    name: "Team 1",
                    value: namesTeamOne.join("\n"),
                    inline: true,
                },
                {
                    name: "Team 2",
                    value: namesTeamTwo.join("\n"),
                    inline: true,
                }
            )
            .setFooter(`Some footer`);

        return fightDetailsEmbed
    }

    _abilityPickerEmbed = (player, abilitiesString, extraFields = (fields) => {}) => {
        const { sideColor } = this.options

        const displayHealth = player => {
            return {
                name: `${this._getName(player)} HP:`,
                value: this._displayPlayerHp(player),
                inline: true,
            }
        }
    
        const topLeft = this.game.teamOne.map(displayHealth);
        const topRight = this.game.teamTwo.map(displayHealth);
    
        // const midRight = {
        //     name: teamGreenName,
        //     value: teamGreenOverview,
        //     inline: true,
        // };
    
        // const bottomRight = {
        //     name: `Choose your ability ${this._getName(user)}!`,
        //     value: abilitiesString,
        //     inline: true,
        // };
        const newLineSpace = {
            name: "\u200B",
            value: "\u200B",
            inline: false,
        };
    
    
        const combatFields = [
            topLeft,
            topRight,
            newLineSpace,
            // midLeft,
            // midRight,
            // newLineSpace,
            // bottomLeft,
        ];

        if(this.previousAbilityResponse.length){
            const midLeft = {
                name: "Previous turn's",
                value: this.previousAbilityResponse.join("\n \n"),
                inline: true,
            };
            // combatFields.splice(3, 0, midLeft)
            combatFields.push(midLeft)
            this.previousAbilityResponse = []
        }

        if(player && abilitiesString){
            const bottomLeft = {
                name: `Choose your ability ${this._getName(player)}!`,
                value: abilitiesString,
                inline: true,
            };
            combatFields.push(bottomLeft)
            combatFields.push(newLineSpace)
        }

        if(this.deathMessages.length || this.effectMessages.length){
            const midRight = {
                name: "Effects",
                value: this.effectMessages.join("\n \n") + this.deathMessages.join("\n"),
                inline: true
            }

            combatFields.push(midRight)

            this.deathMessages = []
            this.effectMessages = []
        }

        extraFields(combatFields)

        const title = `${this._getName(player)}'s turn!`
        const attachment = new Discord.MessageAttachment(`./assets/classes/${player.className}.png`, `${player.className}.png`);
        const embedResult = new Discord.MessageEmbed()
		    .attachFiles(attachment)
            .setTitle(title)
            // .setDescription(description)
            .setColor(sideColor || this.defaultSideColor)
            .addFields(...combatFields)
            // .setImage(`../../assets/classes/${player.className}.png`)
		    .setThumbnail(`attachment://${player.className}.png`)
            // .setFooter(Object.values(winner).length ? winner.msg : footer);
        return embedResult;
    };

    _endGameExtraFieldsEmbed = (winningTeam, fields) => {
        const bottomField = {
            name: `The combat has ended and the winner${winningTeam.length > 1 ? "'s are" : "is"}:`,
            value: winningTeam.map(u => this._getName(u)).join(", ").replace(/$/),
            inline: true
        }

        fields.push(bottomField)
    }
}

module.exports = { CombatMessageAPI }