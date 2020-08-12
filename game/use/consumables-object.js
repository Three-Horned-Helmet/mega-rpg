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
	Carrot: {
		name: "Carrot",
		visibleInShop:false,
		healingValue: null,
		price: null,
		requirement: null,
		execute: async (user, item) =>{
			return await consumeCarrot(user, item);
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

const consumeCarrot = async (user, item)=>{
	if (user.hero.inventory[item] < 1) {
		return `You don't have any ${item} to consume`;
	}
	// if already under influence of carrot perk, return false
	const perks = [
		{ cooldownReduction:{
			chance: 5,
			name: "Cooldown reduction",
			reduction: ()=> Math.random() * 0.49 + 0.5,
			durationInMs: ()=> Math.floor(Math.random() * 5 + 2) * 1000 * 60
		} },
		{ randomCooldownReset:{
			chance: 5,
			name: "Random Cooldown Reset",
			reduction: ()=> Math.random() * 0.49 + 0.5,
			durationInMs: ()=> Math.floor(Math.random() * 5 + 2) * 1000 * 60
		} },
		{ randomBuildingUpgrade:{
			chance: 5,
			name: "Random building upgrade for free",
		} },
		{ goldPrize: {
			chance: 40,
			name: "Gold Prize",
		} },
		{ resourcePrize:{
			chance: 30,
			name: "Resource Prize",
		} }
	];
};

module.exports = consumablesObject;