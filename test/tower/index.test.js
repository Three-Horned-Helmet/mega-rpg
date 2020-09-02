/* eslint-disable no-undef */

const { expect } = require("chai");
const User = require("../../models/User");

const towerCommand = require("../../commands/tower");
const equipCommand = require("../../commands/destroy");

const { getRandomPrefix, getPrefixMultiplier } = require("../../game/items/tower-items/tower-item-prefix");
const { getNewTowerItem, getTowerItem, isTowerItem } = require("../../game/items/tower-items/tower-item-functions");
const { getArmyTowerEnemies } = require("../../game/tower/army-tower/army-tower-enemies/army-tower-enemies");

const allItems = require("../../game/items/all-items");

const { createTestUser, generateDiscordMessage } = require("../helper");


describe("tower functions and command", () => {
	beforeEach("beforeEach, cleaning db", async ()=>{
		await User.deleteMany();
	});

	it("destroy command should exist", () => {
		expect(towerCommand).to.not.equal(undefined);
	});

	// Tower Prefix
	it("getRandomPrefix returns a string", () => {
		expect(typeof getRandomPrefix() === "string").to.equal(true);
	});

	it("getPrefixMultiplier returns a number", () => {
		const prefix = getRandomPrefix();
		expect(typeof getPrefixMultiplier(prefix) === "number").to.equal(true);
	});

	// Tower functions
	it("getNewTowerItem returns a string", () => {
		expect(typeof getNewTowerItem(5) === "string").to.equal(true);
	});

	it("isTowerItem returns true on a tower drop item", () => {
		const newItem = getNewTowerItem(10);
		expect(isTowerItem(newItem)).to.equal(true);
	});

	it("isTowerItem returns false on item not from tower", () => {
		expect(isTowerItem("Rambadam of the broken saw")).to.equal(false);
	});

	it("getTowerItem returns an object", () => {
		const newItem = getNewTowerItem(5);
		expect(typeof getTowerItem(newItem) === "object").to.equal(true);
	});

	it("getNewTowerItem has its stats generated dependent of the tower level", () => {
		const newItemOne = getTowerItem(getNewTowerItem(1));
		const newItemTwo = getTowerItem(getNewTowerItem(100));

		const itemOneStats = Object.values(newItemOne.stats).reduce((acc, cur) => acc + cur);
		const itemTwoStats = Object.values(newItemTwo.stats).reduce((acc, cur) => acc + cur);

		expect(itemOneStats + 50).to.be.below(itemTwoStats);
	});

	it("getArmyTowerEnemies should always return a unit with stats and name", () => {
		const newEnemies = [];
		for(let i = 0; i < 20; i++) {
			const randomLevel = Math.floor(Math.random() * 1000);
			const enemy = getArmyTowerEnemies(randomLevel);
			enemy.randomLevel = randomLevel;
			newEnemies.push(enemy);
		}
		expect(newEnemies.length === 20).to.equal(true);

		let hasStats = true;
		let hasName = true;
		newEnemies.forEach(enemy => {
			if(!enemy.stats) {
				hasStats = false;
				console.error("This enemy does not have stats:", enemy);
			}
			else if(!enemy.name) {
				hasName = false;
				console.error("This enemy does not have name:", enemy);
			}
		});

		expect(hasStats).to.equal(true);
		expect(hasName).to.equal(true);
	});

	it("equipping and unequipping Tower items should not alter the users base stats", async () => {
		const testUser = await createTestUser();
		const newItemOne = getTowerItem(getNewTowerItem(1));
		const newItemTwo = getTowerItem(getNewTowerItem(100));
		testUser.addItem(newItemOne, 1);
		testUser.addItem(newItemTwo, 1);

		const mockMessage = generateDiscordMessage(testUser);
		await equipCommand.execute(mockMessage, [newItemOne.name], testUser);

		const healthBefore = testUser.hero.health;
		const attackBefore = testUser.hero.attack;

		await equipCommand.execute(mockMessage, [newItemTwo.name], testUser);
		await equipCommand.execute(mockMessage, [newItemOne.name], testUser);
		await equipCommand.execute(mockMessage, [newItemTwo.name], testUser);
		await equipCommand.execute(mockMessage, [newItemOne.name], testUser);

		const healthAfter = testUser.hero.health;
		const attackAfter = testUser.hero.attack;

		expect(healthBefore).to.equal(healthAfter);
		expect(attackBefore).to.equal(attackAfter);
	});

	it("equipping and unequipping Tower items and normal items should not alter the users base stats", async () => {
		const testUser = await createTestUser();
		const newItemOne = getTowerItem(getNewTowerItem(1));
		const newItemTwo = Object.values(allItems).filter(item => item.typeSequence[item.typeSequence.length - 1] === newItemOne.typeSequence[newItemOne.typeSequence.length - 1])[0];
		testUser.addItem(newItemOne, 1);
		testUser.addItem(newItemTwo, 1);

		const mockMessage = generateDiscordMessage(testUser);
		await equipCommand.execute(mockMessage, [newItemOne.name], testUser);

		const healthBefore = testUser.hero.health;
		const attackBefore = testUser.hero.attack;

		await equipCommand.execute(mockMessage, [newItemTwo.name], testUser);
		await equipCommand.execute(mockMessage, [newItemOne.name], testUser);
		await equipCommand.execute(mockMessage, [newItemTwo.name], testUser);
		await equipCommand.execute(mockMessage, [newItemOne.name], testUser);

		const healthAfter = testUser.hero.health;
		const attackAfter = testUser.hero.attack;

		expect(healthBefore).to.equal(healthAfter);
		expect(attackBefore).to.equal(attackAfter);
	});
});
