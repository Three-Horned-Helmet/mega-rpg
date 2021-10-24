class CombatMessageAPI {
    constructor(channel) {
        this.channel = channel
    }

    // pickAbilityMessage = async (player, abilities) => {
    //     const playerName = player.name
    //     const allLetters = "abcefghijklmnopqrstuvwxyz".split("")
    //     const abilitiesString = `${playerName}: Can pick from abilities ${abilities.map((a, i) => allLetters[i] + ") " + a.constants.name).join(", ")}`
    //     let ability = undefined
    //     let pickAbilityTimeout = false
    //     setTimeout(() => {
    //         pickAbilityTimeout = true
    //     }, 10000)

    //     while(!ability && !pickAbilityTimeout){
    //         // TODO GIVE A TIME FOR THEIR RESPONSE
    //         const playerResponse = await this.channel(abilitiesString)
    //         const indexOfPlayerResponse = allLetters.indexOf(playerResponse[0])
    //         ability = abilities[indexOfPlayerResponse]
    //     }

    //     if(pickAbilityTimeout) {
    //         return console.log(playerName + " did not respond in time and lost its turn")
    //     }
    //     else {
    //         return ability
    //     }
    // }

    // deathMessage = async (players = []) => {
    //     players.forEach((player) => {
    //         console.log(player.name + " has died")
    //     })
    // }

    // effectMessage = async (message) => {
    //     return console.log(message)
    // }

    // abilityMessage = async (abilityResponse) => {
    //     return console.log(abilityResponse)
    // }

    // newRoundMessage = async (round) => {
    //     return console.log("New round: " + round)
    // }

    // endGameMessage = async (winningTeam) => {
    //     console.log("END GAME! Winner is " + winningTeam ? winningTeam.map(u => u.name).join(" ") : "none")
    //     return process.exit()
    // }
}