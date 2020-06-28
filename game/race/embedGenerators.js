const Discord = require("discord.js");
const { getResourceIcon } = require("../_CONSTS/icons");
const GOLDPRIZE = 500;

const generateRace = (event)=>{
    const sideColor = "#45b6fe";
    const racers = Object.keys(event.raceData).map(r=>{
        let finishTile = "🏁";
        let { dotsLength } = event.raceData[r];
        if (dotsLength < 1) {
            finishTile = r;
            dotsLength = 1;
            r = ". . . ";
        }
        if (dotsLength > 20) {
            dotsLength = 20;
        }
        const firstDots = ". ".repeat(dotsLength);
        const lastDots = ". ".repeat(20 - dotsLength);
        return `${finishTile}${firstDots}${r}${lastDots}`;
    });

    let leadingCharacter;
    let fewestDots = 30;
    Object.keys(event.raceData).forEach(r=>{
        if (event.raceData[r].dotsLength < fewestDots) {
            fewestDots = event.raceData[r].dotsLength;
            leadingCharacter = r;
        }
    });

    const leader = `Leader: ${leadingCharacter}\n`;
    const betters = new Set();
    event.participants.forEach((betInfo, username)=>{
        betters.add(`${betInfo.racer} ${username}`);
    });

        const embedRace = new Discord.MessageEmbed()
            .setTitle("🏇 RACE! 🏇")
            .setColor(sideColor)
            .addFields(
                {
                    name: "Bets\n",
                    value: Array.from(betters),
                    inline: true,
                },
            )
            .addFields(
                {
                    name: leader,
                    value: racers,
                    inline: true,
                },
            );
        return embedRace;
    };

    const generateEndResult = (event, raceData)=> {
        const sideColor = "#45b6fe";
        const winners = [];
        const losers = [];
        event.participants.forEach((betInfo, username)=>{
            if (betInfo.racer === event.winner) {
                winners.push(username);
            }
        else {
                losers.push(username);
            }
        });
        const winningCharacter = event.winner;

        let weightedMultiplier = 20 - raceData[event.winner].weight;
        weightedMultiplier = weightedMultiplier ? weightedMultiplier : 1;

        const reward = weightedMultiplier * GOLDPRIZE + 500;

        const winningTitle = `\n Every winner get ${getResourceIcon("gold")} ${reward}:`;
        const losingTitle = "\n Losers get nothin':";

        const fields = [];
        if (winners.length) {
            fields.push({
                name: winningTitle,
                value: winners,
                inline: true,
            });
        }
        if (losers.length) {
            fields.push({
                name: losingTitle,
                value: losers,
                inline: true,
            });
        }


        const winningResults = new Discord.MessageEmbed()
            .setTitle("🏇 RACE OVER! 🏇")
            .setDescription(`WINNER IS: ${winningCharacter}\n`)
            .setColor(sideColor)
            .addFields(
                ...fields,
            );
        return winningResults;
    };

    const createRaceInvitation = (user, raceData, state = null)=>{
        const sideColor = "#45b6fe";
        const username = user.account.username;


            const racers = Object.keys(raceData).map(r=>{
                let weightedMultiplier = 20 - raceData[r].weight;
                weightedMultiplier = weightedMultiplier ? weightedMultiplier : 1;
                return `${r} --- ${getResourceIcon("gold")} ${(weightedMultiplier * GOLDPRIZE) + 500}`;
            });
            let bettingState = "```diff\n- PLEASE WAIT ```";
                if (state === "ready") {
                    bettingState = "```fix\n GET READY! \n```";
                }
                if (state === "go") {
                    bettingState = "```diff\n+ PLACE YOUR BETS! ```";
                }

            const embedInvitation = new Discord.MessageEmbed()
                .setTitle(`🏇 ${username} is inviting to a race!! 🏇`)
                .setDescription(`Costs ${getResourceIcon("gold")} ${GOLDPRIZE} to participate!`)
                .setColor(sideColor)
                .addFields(
                    {
                        name: "Racers & Rewards:",
                        value: racers,
                        inline: false,
                    },
                    {
                        name: "Betting status:",
                        value: bettingState,
                        inline: false,
                    },
                );

            return embedInvitation;
        };

    module.exports = { generateRace, generateEndResult, createRaceInvitation };