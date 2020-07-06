const Discord = require("discord.js");
const { getResourceIcon, getPlaceIcon } = require("../game/_CONSTS/icons");

function generateEmbedPveFullArmy(user, placeInfo, pveResult, questIntro = false) {
    if (pveResult.win) {
        return generateEmbedPveFullArmyWin(user, placeInfo, pveResult, questIntro);
    }
    return generateEmbedPveFullArmyLoss(user, placeInfo, pveResult);
}


function generateEmbedPveHero(user, placeInfo, pveResult, questIntro = false) {
    if (pveResult.win) {
        return generateEmbedPveHeroWin(user, placeInfo, pveResult, questIntro);
    }
    return generateEmbedPveHeroLoss(user, placeInfo, pveResult);

}

function generateEmbedPveFullArmyWin(user, placeInfo, pveResult, questIntro) {
    const sideColor = "#45b6fe";
    const placeName = placeInfo.name;
    const placeIcon = getPlaceIcon(placeInfo.type);

    const { username } = user.account;
    const title = `${username}'s army raided ${placeIcon} ${placeName}`;

    const resourceReward = Object.keys(pveResult.resourceReward).map(r=>{
        return `${getResourceIcon(r)} ${r}: **${pveResult.resourceReward[r]}**`;
    });

    let expReward = `+ **${pveResult.expReward}** exp\n`;

    const casualtiesPercentage = (pveResult.lossPercentage * 100).toFixed(2);
    const casulty = generateArmyCasultyString(casualtiesPercentage);
    const heroHpLoss = Math.floor(user.hero.currentHealth * pveResult.lossPercentage);
    const heroCasulty = generateHeroCasulty(heroHpLoss, placeName);

    if (pveResult.levelUp) {
        expReward += "💪 You leveled up! 💪";
    }

    const fields = [
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
    ];

    if(questIntro) {
        fields.push({
            name: "Quest",
            value: questIntro,
        });
    }

    const embedWin = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(sideColor)
    .addFields(
        ...fields,
    );
return embedWin;
}

// raid
function generateEmbedPveFullArmyLoss(user, placeInfo, pveResult) {
    const sideColor = "#45b6fe";
    const placeName = placeInfo.name;
    const placeIcon = getPlaceIcon(placeInfo.type);

    const { username } = user.account;
    const title = `${username} failed to raid ${placeIcon} ${placeName} `;

    let expReward = `+ **${pveResult.expReward}** exp\n`;

    const status = generateArmyLossStatus(placeName, user.hero.rank);

    if (pveResult.levelUp) {
        expReward += "💪 You leveled up! 💪";
    }

    const fields = [
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
    ];
    if (pveResult.heroDemote) {
        fields.push({
            name: "Ouch!",
            value: generateHeroRankLoss(),
        });
    }

    const embedLoss = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(sideColor)
    .addFields(
        ...fields,
    )
    .setFooter("Tip: You can buy healing potions in the shop");

return embedLoss;
}

function generateEmbedPveHeroWin(user, placeInfo, pveResult, questIntro) {
    const sideColor = "#45b6fe";
    const placeName = placeInfo.name;
    const placeIcon = getPlaceIcon(placeInfo.type);

    const { username } = user.account;
    const title = `${username}'s hero hunted ${placeIcon} ${placeName}`;

    const resourceReward = Object.keys(pveResult.resourceReward).map(r=>{
        return `${getResourceIcon(r)} ${r}: **${pveResult.resourceReward[r]}**`;
    });

    let expReward = `+ **${pveResult.expReward}** exp\n`;

    const heroHpLoss = Math.floor(user.hero.currentHealth * pveResult.lossPercentage);
    const heroCasulty = generateHeroCasulty(heroHpLoss, placeName);

    if (pveResult.levelUp) {
        expReward += "💪 You leveled up! 💪";
    }

    const fields = [
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
            value:  heroCasulty,
            inline: false,
        },
    ];

    if(questIntro) {
        fields.push({
            name: "Quest",
            value: questIntro,
        });
    }

    const embedWin = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(sideColor)
    .addFields(
        ...fields,
    );
return embedWin;
}

// hunt
function generateEmbedPveHeroLoss(user, placeInfo, pveResult) {
    const sideColor = "#45b6fe";
    const placeName = placeInfo.name;
    const placeIcon = getPlaceIcon(placeInfo.type);

    const { username } = user.account;
    const title = `${username}'s army failed to hunt ${placeIcon} ${placeName} `;

    let expReward = `+ **${pveResult.expReward}** exp\n`;

    const status = generatePveHeroLoss(placeName, user.hero.rank);

    if (pveResult.levelUp) {
        expReward += "💪 You leveled up! 💪";
    }

    const fields = [
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
    ];
    if (pveResult.heroDemote) {
        fields.push({
            name: "Ouch!",
            value: generateHeroRankLoss(),
        });
    }

    const embedLoss = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(sideColor)
    .addFields(
        ...fields,
    )
    .setFooter("Tip: You can buy healing potions in the shop");

return embedLoss;
}

function generateArmyCasultyString(percentage = "All") {
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
    const strings = [
        `Your hero fell and twisted his ankle while running into battle losing **${hp}**hp`,
        `Your hero fell off your horse losing **${hp}**hp`,
        `An orc attacked your hero in the **${placeName}** causing your hero to lose **${hp}**hp`,
        `The **${placeName}** put up a fight and caused your hero to lose **${hp}**hp`,
        `Your hero fought bravely but got an arrow to his knee. Hp -**${hp}**`,
        `Your hero made it safely through the **${placeName}**, only losing **${hp}**hp`,
        `Your hero suffered during the mission and lost **${hp}**hp`,
        `**${placeName}** took a toll on your hero. Hp -**${hp}**`,
    ];
    return strings[Math.floor(Math.random() * strings.length)];
}


function generateArmyLossStatus(placeName) {
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
    return strings[Math.floor(Math.random() * strings.length)];
}

function generatePveHeroLoss(placeName) {
    const strings = [
        `**${placeName}** proved to be too challenging for your hero`,
        `Your somehow managed to die in **${placeName}**`,
        `Your hero bravely tried to hunt **${placeName}** - but failed!`,
        `Mission failiure! **${placeName}** was too hard for your hero!`,
        `**${placeName}** was too much for your hero. Heal up and try again later`,
        `Your hero fought to the bitter end, but **${placeName}** claimed his life!`,
        `The weather was harsh and your hero died before even reaching **${placeName}**`,
        `Your hero went on a simple hunt in **${placeName}** - and died..`,
    ];
    return strings[Math.floor(Math.random() * strings.length)];
}

function generateHeroRankLoss() {
    const strings = [
        "Your actions lead to your hero losing a rank",
        "You hero suffered a loss of rank",
        "Your hero performed so bad that it caused a loss in rank",
        "Your hero rank is now one less than before",
        "Your hero is punished with a demotion",
    ];
    return strings[Math.floor(Math.random() * strings.length)];
}


module.exports = { generateEmbedPveFullArmy, generateEmbedPveHero, generateArmyLossStatus, generateHeroRankLoss, generateHeroCasulty, generateArmyCasultyString };