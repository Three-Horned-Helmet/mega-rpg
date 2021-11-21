const { GameEngine } = require("@three-horned-helmet/combat-system-mega-rpg");
const { CombatMessageAPI } = require("./CombatMessageAPI");

const preGameHandler = async (message, teamOne, teamTwo, options = {}) => {
	const messageAPI = new CombatMessageAPI(message, options);
	const game = new GameEngine(messageAPI, teamOne, teamTwo, options = {});
	await messageAPI.genericPrefightRuleGenerator();

	game.startGame();
};

module.exports = { preGameHandler };