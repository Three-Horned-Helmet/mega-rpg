const {onCooldown} = require("../_CONSTS/cooldowns")

const handleFish = async (user) => {
    console.log('handlefish function!')
    const {explored} = user.world.locations["Grassy Plains"]
    const {currentLocation} = user.world
    const onCooldownInfo = onCooldown('fish', user)

    const now = new Date()
    if (onCooldownInfo.response){
        return onCooldownInfo.embed
    }
    if(!explored.includes("River")){
        return `You have not explored any rivers yet in ${currentLocation}`
    }


    const randomNumber = Math.random()
    const chance = 0.5

    let goldResult=0
    let fish = ['Cod','Trout','Swordfish']
    let fishResult = ''

    if (randomNumber>chance){
        fishResult = fish[Math.floor(Math.random()*fish.length)] // 'Swordfish'
        let multiplier = fish.indexOf(fishResult) // 0,1,2
        goldResult = Math.floor(multiplier * 20 + (Math.random()*10)) // 0-50

        return `you caught a ${fishResult} and sold it for ${goldResult} gold`
    }
    user.handleFishResult(goldResult,now)

    return generateFailFishSentence()
}

const generateFailFishSentence = ()=>{
    const sentences = [
        "You fished for hours with no luck",
        "You lost your bait while fishing",
        "You caught an old boot",
        "You put your fishing rod down and took a swim instead"]
        return sentences[Math.floor(Math.random()*sentences.length)]
}

module.exports={handleFish}