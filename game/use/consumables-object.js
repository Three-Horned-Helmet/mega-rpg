const consumablesObject = {
	["Small Heal Potion"]: {
		name: "Small Heal Potion",
		healingValue: 100,
		price: 10,
		requirement: {
			building: "shop",
			level: 0,
		},
		execute: async (user, item) =>{
			return await useHealingPotion(user, item);
		},
	},
	["Large Heal Potion"]: {
		name: "Large Heal Potion",
		healingValue: 400,
		price: 37,
		requirement: {
			building: "shop",
			level: 1,
		},
		execute: async (user, item) =>{
			return await useHealingPotion(user, item);
		},
	},
};

const useHealingPotion = async (user, item) =>{
	// Does the user have the item
	if(!(user.hero.inventory[item.name] > 0)) return `You have no ${item.name} in your inventory`;
	if(user.hero.currentHealth >= user.hero.health) return "You already have full health";

	user.healHero(item.healingValue, item.name);

	const updatedUser = await user.save();

	return `You drank a ${item.name} and your hero has ${updatedUser.hero.currentHealth}/${updatedUser.hero.health} hp left`;
};

module.exports = consumablesObject;