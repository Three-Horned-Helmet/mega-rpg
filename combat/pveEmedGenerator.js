const Discord = require("discord.js");
const { getResourceIcon, getPlaceIcon } = require("../game/_CONSTS/icons");

function generateEmbedPveFullArmy(user, placeInfo, raidResult) {
    if (raidResult.win) {
        return generateEmbedPveFullArmyWin(user, placeInfo, raidResult);
    }
    return generateEmbedPveFullArmyLoss(user, placeInfo, raidResult);
}

function generateEmbedPveFullArmyWin(user, placeInfo, raidResult) {
    const sideColor = "#45b6fe";
    const placeName = placeInfo.name;
    const placeIcon = getPlaceIcon(placeInfo.type);

    const { username } = user.account;
    const title = `${username}'s army raided ${placeIcon} ${placeName}`;

    const resourceReward = Object.keys(raidResult.resourceReward).map(r=>{
        return `${getResourceIcon(r)} ${r}: **${raidResult.resourceReward[r]}**`;
    });

    let expReward = `+ **${raidResult.expReward}** exp\n`;

    const casualtiesPercentage = (raidResult.lossPercentage * 100).toFixed(2);
    const casulty = generateCasultyString(casualtiesPercentage);
    const heroHpLoss = Math.floor(user.hero.currentHealth * raidResult.lossPercentage);
    const heroCasulty = generateHeroCasulty(heroHpLoss, placeName);

    if (raidResult.levelUp) {
        expReward += "💪 You leveled up! 💪";
    }

    // adds current exp status and shows how close the player is to leveling up
 /* else {!
     const { expToNextRank } = user.hero;
     const currentExp = user.hero.currentExp + raidResult.expReward;
        expReward += `${currentExp}/${expToNextRank}`;
    } */

    const embedWin = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(sideColor)
    .addFields(
        {
            name: "Resources",
            value: resourceReward,
            inline: false,
        },
        {
            name: "Experience",
            value: expReward,
            inline: false,
        },
        {
            name: "Casualties",
            value: [casulty, heroCasulty],
            inline: false,
        },
    );
return embedWin;
}


function generateEmbedPveFullArmyLoss(user, placeInfo, raidResult) {
    const sideColor = "#45b6fe";
    const placeName = placeInfo.name;
    const placeIcon = getPlaceIcon(placeInfo.type);

    const { username } = user.account;
    const title = `${username}'s army failed to raid ${placeIcon} ${placeName} `;

    let expReward = `+ **${raidResult.expReward}** exp\n`;

    const status = generateLossStatus(placeName, user.hero.rank);

    if (raidResult.levelUp) {
        expReward += "💪 You leveled up! 💪";
    }

    // adds current exp status and shows how close the player is to leveling up
 /* else {
     const { expToNextRank } = user.hero;
     const currentExp = user.hero.currentExp + raidResult.expReward;
        expReward += `${currentExp}/${expToNextRank}`;
    } */


    const embedLoss = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(sideColor)
    .addFields(
        {
            name: "Experience",
            value: expReward,
            inline: false,
        },
        {
            name: "Status",
            value: status,
            inline: false,
        },
    )
    .setFooter("Tip: You can buy healing potions in the shop");
return embedLoss;
}

function generateCasultyString(percentage = "All") {
    let casultyResult = `**${percentage}**% of your men `;
    const strings = [
        "died horribly",
        "fled the battlefield",
        "surrendered to the enemy",
        "were captured by the enemy",
        "starved to death",
        "fell in battle",
    ];
    casultyResult += strings[Math.floor(Math.random() * strings.length)];
    return casultyResult;
}

function generateHeroCasulty(hp, placeName) {
    let heroCasultyResult = "";
    const strings = [
        `Your hero fell and twisted his ankle while running into battle losing **${hp}h**p`,
        `Your hero fell off your horse losing **${hp}**hp`,
        `An orc attacked your hero in the **${placeName}** causing your hero to lose **${hp}**hp`,
        `The **${placeName}** put up a fight and caused your hero to lose **${hp}**hp`,
        `Your hero fought bravely but got an arrow to his knee. Hp -**${hp}**`,
        `Your hero made it safely through the **${placeName}**, only losing **${hp}**hp`,

    ];
    heroCasultyResult += strings[Math.floor(Math.random() * strings.length)];
    return heroCasultyResult;
}

function generateLossStatus(placeName, heroRank) {
    let statusResult = "";
    const strings = [
        `Your hero and the whole army all died in **${placeName}** `,
        `Your lost all your men in **${placeName}** - somehow your hero died too`,
        `It was a suicide mission trying to raid **${placeName}** - your hero and army are now gone`,
        `Mission failiure! **${placeName}** was too hard for your hero and your men!`,
        `You left your army and hero to die in **${placeName}**!`,
        `You somehow managed to lose your whole army and hero in **${placeName}**!`,
        `**${placeName}** claimed your whole army and hero!`,
        `Your army was no match for **${placeName}** - how awkward!`,
    ];
    statusResult += strings[Math.floor(Math.random() * strings.length)];
    if (heroRank) {
        "Your hero lost a rank";
    }
    return statusResult;
}


module.exports = { generateEmbedPveFullArmy };