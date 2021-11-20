const { createGridCanvas, successfullyPickedClassEmbed, somethingWentWrongEmbed } = require("./pick-class-embed")
const startingClasses = require("../accessible-classes.json").startingClasses

const pickClassHandler = async (message, user) => {
    const PICK_CLASS_TIMER_MS = 15 * 1000
    const pickClassCanvas = await createGridCanvas()

    await message.channel.send(pickClassCanvas)

    const filter = (response) => {
        // checks if person included included in the fight
        return user.account.userId === response.author.id;
    };

    const collector = await message.channel.createMessageCollector(filter, {
        time: PICK_CLASS_TIMER_MS,
        errors: ["time"],
    });

    let pickedClass;
    collector.on("collect", async (result) => {
        if (result.author.bot) {
            return;
        }

        if(!result.content) return

        pickedClass = startingClasses.find(startingClass => {
            const splitResult = result.content.split(" ")
            if(splitResult[0] === "!pick" && splitResult.length === 2){
                return startingClass.toLowerCase() === splitResult[1].toLowerCase()
            }
        })

        if(!pickedClass) return

        // stops collecting if all humans have answered
        // await sleep(1500);
        collector.stop();
    });

    // TODO: Error handling (on timeout)
    collector.on("end", async () => {
        if(!pickedClass){
            return message.channel.send(`<@${message.author.id}>: You did not pick a class within the timelimit. Please try again.`)
        }

        try {
            user.pickClass(pickedClass)
            await user.save()

            await message.channel.send(`<@${message.author.id}>: ${successfullyPickedClassEmbed(pickedClass)}`)
        }
        catch {
            message.channel.send(`<@${message.author.id}>: ${somethingWentWrongEmbed()}`)
            console.error("Something went wrong while picking a class: ", pickedClass, user)
        }
    });
}

module.exports = { pickClassHandler }