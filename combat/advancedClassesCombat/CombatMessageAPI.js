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

    sendMessage(message){
        return this.message.channel.send(message)
    }

    genericPrefightRuleGenerator = async () => {
        console.log("genericPrefightRuleGenerator")
        const rulesEmbed = this._fightDetailsEmbed()
        await this.message.channel.send(rulesEmbed);

    }

    pickAbilityMessage = async (player, abilities) => {
        console.log("pickAbilityMessage")
        const { name } = player;
        const allLetters = "abcefghijklmnopqrstuvwxyz".split("")
        const capitalizeFirstLetter = (string) => {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }
        const abilitiesString = `__${name}:__ Can pick from abilities: \n ${abilities.map((a, i) => `${allLetters[i]}) ${capitalizeFirstLetter(a.constants.name)}`).join("\n")}`

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
            console.log("result.content", result.content)
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
        console.log("deathMessage")
        this.deathMessages = this.deathMessages.concat(players)
    }

    effectMessage = async (message) => {
        console.log("effectMessage")
        this.effectMessages.push(message)
    }

    abilityMessage = async (abilityResponse) => {
        console.log("abilityMessage")
        this.previousAbilityResponse.push(abilityResponse)
    }

    newRoundMessage = async (round) => {
        console.log("newRoundMessage")
        this.round = round
    }

    endGameMessage = async (winningTeam) => {
        console.log("endGameMessage")
        const extraFields = (fields) => {
            this._endGameExtraFieldsEmbed(winningTeam, fields)
        }
        // Winning team kan være null
        const lastCombatTurnEmbed = await this._abilityPickerEmbed(winningTeam ? winningTeam[0] : this.game.teamOne[0], null, extraFields)
        await this.message.channel.send(lastCombatTurnEmbed)
    }

    _getName = player => {
        console.log("_getName")
        return player.name || player?.account.username || "npc"
    }

    _displayPlayerHp = (player) => {
        console.log("_displayPlayerHp")
        // embed get's messed up if hp bar is longer than 20
        const HEALTH_BARS_COUNT = 19;
        const { health, currentHealth } = player;
        let missingHealthBars = Math.floor(((currentHealth * 100) / health) / (100 / HEALTH_BARS_COUNT))


        if(missingHealthBars < 0) missingHealthBars = 0
        
        if (player.team === 2) {
            return `\`\`\`diff\n- ${"|".repeat(missingHealthBars)}${" ".repeat(HEALTH_BARS_COUNT - missingHealthBars)} \n \`\`\``;
        }
        return `\`\`\`diff\n+ ${"|".repeat(missingHealthBars)}${" ".repeat(HEALTH_BARS_COUNT - missingHealthBars)} \n \`\`\``;
    };

    _fightDetailsEmbed = () => {
        console.log("_fightDetailsEmbed")
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

    _abilityPickerEmbed = (player, abilitiesString, extraFields = () => {}) => {
        console.log("_abilityPickerEmbed")
        const { sideColor } = this.options

        const newLineSpace = {
            name: "\u200B",
            value: "\u200B",
            inline: false,
        };

        const displayHealth = (player, index) => {
            return {
                name: `${this._getName(player)} HP:`,
                value: this._displayPlayerHp(player),
                inline: true,
            }
        }
        
        // TODO: Add newLineSpace to make it align perfectly when several players are present in the fight  
        const teamOneHealthField = this.game.teamOne.map(displayHealth);
        const teamTwoHealthField = this.game.teamTwo.map(displayHealth);

        
        const combatFields = [
            ...teamOneHealthField,
            ...teamTwoHealthField,
            newLineSpace,
        ];
        
        if(this.previousAbilityResponse.length){
            const previousAbilitiesField = {
                name: "Previous turn",
                value: this.previousAbilityResponse.join("\n \n"),
                inline: true,
            };
            // combatFields.splice(3, 0, previousAbilitiesField)
            combatFields.push(previousAbilitiesField)
            this.previousAbilityResponse = []
        }

        if(player && abilitiesString){
            const pickAbilitiesField = {
                name: `Choose your ability, ${this._getName(player)}!`,
                value: abilitiesString,
                inline: true,
            };
            combatFields.push(pickAbilitiesField)
            combatFields.push(newLineSpace)
        }

        if(this.deathMessages.length || this.effectMessages.length){
            const effectsField = {
                name: "Effects",
                value: this.effectMessages.join("\n \n") + this.deathMessages.map(p => this._getName(p) + " has died").join("\n"),
                inline: true
            }

            if(combatFields.length % 2 !== 0){
                combatFields.push(newLineSpace)
            }
            combatFields.push(effectsField)

            this.deathMessages = []
            this.effectMessages = []
        }

        extraFields(combatFields)

        const title = `${this._getName(player)}'s turn!`

        const className = player.className || player?.hero.className || "no-image"
        const attachment = new Discord.MessageAttachment(`./assets/classes/full-image/${className}.png`, `${className}.png`);
        
        const embedResult = new Discord.MessageEmbed()
		    .attachFiles(attachment)
            .setTitle(title)
            .setColor(sideColor || this.defaultSideColor)
            .addFields(...combatFields)
		    .setThumbnail(`attachment://${player.className}.png`)
        return embedResult;
    };

    _endGameExtraFieldsEmbed = (winningTeam, fields) => {
        console.log("_endGameExtraFieldsEmbed")
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
        console.log("handleRewards")
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