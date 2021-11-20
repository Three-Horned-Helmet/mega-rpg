const { allClasses } = require("@three-horned-helmet/combat-system-mega-rpg")

module.exports = {
	name: "describe",
	description: "Describes a class",
    usage: "!hero describe <className>",
	async execute(message, args, user) {
        if(!args.length) return message.channel.send(this.usage)

        const capitalizeFirstLetter = (string) => {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
          }
        const convertFromCamelcase = (string) => {
            return capitalizeFirstLetter(string.replace(/([A-Z])/g, " $1"));
        }

		const classInfo = allClasses[capitalizeFirstLetter(args[0])]

        if(classInfo){
            const { abilityConstants, description } = classInfo
            const abilitiesKeys = Object.keys(abilityConstants)
            const abilitiesStrings = abilitiesKeys.map((abilityKey, i) => `${i+1}) ${convertFromCamelcase(abilityKey)}: *${abilityConstants[abilityKey].description}*`)
            
            const classDescriptionString = `**__${capitalizeFirstLetter(args[0])}:__** \n${description}`
            const abilitiesDescriptionString = `**__Abilities:__** \n${abilitiesStrings.join("\n")}`

            return message.channel.send(`${classDescriptionString}\n\n${abilitiesDescriptionString}`);
        } else {
            return message.channel.send(`The hero **${args[0]}** does not exists. Make sure you wrote the class correctly`)
        }
	},
};