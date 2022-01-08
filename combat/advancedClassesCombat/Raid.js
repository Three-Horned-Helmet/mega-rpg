/* eslint-disable no-inline-comments */
const WorldCombat = require("./WorldCombat");

const NAME_OF_CLASS = "raid";

const config = {
	minHealthPercentage: 0.05, // 5%
	minHealthPoints: 50,
};

const options = {
	maxRounds: 10,
	combatInvitationsAllowed: false,
	armyAllowed: true,
};

class Raid extends WorldCombat {
	constructor(data) {
		super({ ...data, nameOfClass: NAME_OF_CLASS, options });
		this.setupRaid();
	}
	static getNameOfClass() {
		return NAME_OF_CLASS;
	}
	checkRaidAllowed() {
		if (this.user.hero.currentHealth < this.user.hero.health * config.minHealthPercentage && this.user.hero.currentHealth < config.minHealthPoints) {
			return this.errorHandler(`You're too weak to raid (**${this.user.hero.currentHealth} hp**)`);
		}
	}
	setupRaid() {
		this.checkRaidAllowed();
		this.addGreenTeam(this.user);
		this.addGreenTeam(this.convertArmyToNpc(this.user));
		this.addRedTeam(this.convertWorldUnitToNpc(this.placeInfo));
	}
}

module.exports = Raid;