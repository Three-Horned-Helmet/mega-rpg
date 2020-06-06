const consumableObject = {
	["Small Heal Potion"]: {
		name: "Small Heal Potion",
		healingValue: 100,
		execute: async (user) =>{
			console.log("HEALING VALUE ", this.healingValue);
			// Does the user have the item
			if(!(user.hero.inventory[this.name] > 0)) return false;

			const updatedUser = await user.healHero(this.healingValue, this.name);
			return updatedUser.hero.currentHealth;
		},
	},
	["Large Heal Potion"]: {
		name: "Large Heal Potion",
		healingValue: 300,
		execute: async (user) =>{
			console.log("HEALING VALUE ", this.healingValue);
			// Does the user have the item
			if(!(user.hero.inventory[this.name] > 0)) return false;

			const updatedUser = await user.healHero(this.healingValue, this.name);
			return updatedUser.hero.currentHealth;
		},
	},
};

module.exports = { consumableObject };