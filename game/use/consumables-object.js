const consumablesObject = {
	["Small Healing Potion"]: {
		name: "Small Healing Potion",
		healingValue: 200,
		price: 5,
		requirement: {
			building: "shop",
			level: 0,
		},
		execute: async (user, item) =>{
			return await useHealingPotion(user, item);
		},
	},
	["Large Healing Potion"]: {
		name: "Large Healing Potion",
		healingValue: 1200,
		price: 30,
		requirement: {
			building: "shop",
			level: 1,
		},
		execute: async (user, item) =>{
			return await useHealingPotion(user, item);
		},
	},
	["Enourmous Healing Potion"]: {
		name: "Enourmous Healing Potion",
		healingValue: 2000,
		price: 45,
		requirement: {
			building: "shop",
			level: 2,
		},
		execute: async (user, item) =>{
			return await useHealingPotion(user, item);
		},
	},
	["Quality Healing Potion"]: {
		name: "Quality Healing Potion",
		healingValue: 3000,
		price: 60,
		requirement: {
			building: "shop",
			level: 3,
		},
		execute: async (user, item) =>{
			return await useHealingPotion(user, item);
		},
	},
	["Mega Healing Potion"]: {
		name: "Mega Healing Potion",
		healingValue: 4500,
		price: 80,
		requirement: {
			building: "shop",
			level: 4,
		},
		execute: async (user, item) =>{
			return await useHealingPotion(user, item);
		},
	},
	["Ultra Healing Potion"]: {
		name: "Ultra Healing Potion",
		healingValue: 6000,
		price: 100,
		requirement: {
			building: "shop",
			level: 5,
		},
		execute: async (user, item) =>{
			return await useHealingPotion(user, item);
		},
	},
	["Small Healing Salve"]: {
		name: "Small Healing Salve",
		healingValue: 8000,
		price: 140,
		requirement: {
			building: "shop",
			level: 6,
		},
		execute: async (user, item) =>{
			return await useHealingPotion(user, item);
		},
	},
	["Large Healing Salve"]: {
		name: "Large Healing Salve",
		healingValue: 9500,
		price: 160,
		requirement: {
			building: "shop",
			level: 7,
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