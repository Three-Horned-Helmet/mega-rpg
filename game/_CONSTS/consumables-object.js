const consumablesObject = {
	["Small Heal Potion"]: {
		name: "Small Heal Potion",
		healingValue: 100,
		execute: async (user, item) =>{
			// Does the user have the item
			if(!(user.hero.inventory[item.name] > 0)) return `You have no ${item.name} in your inventory`;

			const updatedUser = await user.healHero(item.healingValue, item.name);
			return `You drank a ${item.name} and your hero has ${updatedUser.hero.currentHealth}/${updatedUser.hero.health} hp left`;
		},
	},
	["Large Heal Potion"]: {
		name: "Large Heal Potion",
		healingValue: 300,
		execute: async (user, item) =>{
			// Does the user have the item
			if(!(user.hero.inventory[item.name] > 0)) return `You have no ${item.name} in your inventory`;

			const updatedUser = await user.healHero(item.healingValue, item.name);
			return `You drank a ${item.name} and your hero has ${updatedUser.hero.currentHealth}/${updatedUser.hero.health} hp left`;
		},
	},
};

module.exports = { consumablesObject };