const Discord = require("discord.js");
const combatConstants = require("../../game/_CONSTS/combat.json")
const fs = require('fs'); 

/* 
options: {
    additionalRewards: {
        exp: 300,
        gold: 200
    }
}
*/
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

        const abilityPickerEmbed = await this._abilityPickerEmbed(player, abilitiesString)
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
    }

    effectMessage = async (message) => {
        this.effectMessages.push(message)
    }

    abilityMessage = async (abilityResponse) => {
        this.previousAbilityResponse.push(abilityResponse)
    }

    newRoundMessage = async (round) => {
        this.round = round
    }

    endGameMessage = async (winningTeam) => {
        const extraFields = (fields) => {
            this._endGameExtraFieldsEmbed(winningTeam, fields)
        }
        const lastCombatTurnEmbed = await this._abilityPickerEmbed(winningTeam[0], null, extraFields)
        await this.message.channel.send(lastCombatTurnEmbed)
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

    _abilityPickerEmbed = async (player, abilitiesString, extraFields = (fields) => {}) => {
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
    
        const newLineSpace = {
            name: "\u200B",
            value: "\u200B",
            inline: false,
        };
    
    
        const combatFields = [
            topLeft,
            topRight,
            newLineSpace,
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
                value: this.effectMessages.join("\n \n") + this.deathMessages.map(p => this._getName(p) + " has died").join("\n"),
                inline: true
            }

            if(combatFields.length % 2 !== 0){
                combatFields.push(newLineSpace)
            }
            combatFields.push(midRight)

            this.deathMessages = []
            this.effectMessages = []
        }

        extraFields(combatFields)

        const title = `${this._getName(player)}'s turn!`

        // const attachment = await new Promise ((resolve, reject) => {
        //     fs.stat(`./assets/classes/${player.className}.png`, function(err, stat) {
        //         if(err == null) {
        //             console.log("EXISTS")
        //             resolve(new Discord.MessageAttachment(`./assets/classes/${player.className}.png`, `${player.className}.png`));
        //         } else if(err.code === 'ENOENT') {
        //             console.log("NOT EXISTS")
        //             resolve(new Discord.MessageAttachment(`./assets/classes/warrior.png`, `warrior.png`));
        //         } else {
        //             console.log('Some other error: ', err.code);
        //             reject()
        //         }
        //     });
        // }) 
        const className = player.className || player?.hero.className || "no-image"
        const attachment = new Discord.MessageAttachment(`./assets/classes/${className}.png`, `${className}.png`);
        
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
        const {additionalRewards} = this.options

        const newLineSpace = {
            name: "\u200B",
            value: "\u200B",
            inline: false,
        };

        if(!winningTeam) {
            const bottomLeftField = {
                name: "The combat has ended and the were no winners:",
                value: this.game.combatEndedReason || "For unfortunate reasons",
                inline: true
            }
    
            if(fields.length % 2 !== 0){
                fields.push(newLineSpace)
            }
            
            return fields.push(bottomLeftField)
        }


        const bottomLeftField = {
            name: `The combat has ended and the winner${winningTeam.length > 1 ? "'s are" : " is"}:`,
            value: winningTeam.map(u => this._getName(u)).join(", ").replace(/,$/),
            inline: true
        }

        if(fields.length % 2 !== 0){
            fields.push(newLineSpace)
        }

        fields.push(bottomLeftField)

        if(winningTeam.find(player => !player.isNpc)){
            const rewards = this.handleRewards()
            if(Object.keys(rewards).length){
                const bottomRightField = {
                    name: `Rewards:`,
                    value: Object.entries(rewards).map(reward => `${reward[0]}: ${reward[1]}`).join("\n").replace(/\\n$/),
                    inline: true
                }

                fields.push(bottomRightField)
            }
        }
    }

    handleRewards = () => {
        const { additionalRewards } = this.options
        const allRewards = {}
        const winningUsers = this.game.winningTeam.filter(player => !player.isNpc && player.account?.userId)

        const summarizeRewards = (rewards) => {
            Object.entries(rewards).forEach(reward => {
                allRewards[reward[0]] ? allRewards[reward[0]] += reward[1] : allRewards[reward[0]] = reward[1]
            })
        }

        if(additionalRewards){
            summarizeRewards(additionalRewards)
        }
        
        const usersWithRewards = this.game.losingTeam.filter(player => player.rewards)
        usersWithRewards.forEach(user => {
            summarizeRewards(user.rewards)
        })

        winningUsers.forEach(user => {
            user.gainManyResources(allRewards)
            user.save()
        })

        return allRewards
    }
}

module.exports = { CombatMessageAPI }