/* eslint-disable no-undef */

const { expect } = require("chai");
const User = require("../../models/User");
const useCommand = require("../../commands/use");
const { createTestUser, generateDiscordMessage } = require("../helper");


describe("use commands", () => {
	beforeEach("beforeEach, cleaning db", async ()=>{
		await User.deleteMany();
	});

	it("use command should exist", () => {
		expect(useCommand).to.not.equal(undefined);
	});

	it("should be denied if the arguments match no consumables", async ()=>{
		const testUser = await createTestUser();
		const mockMessage = generateDiscordMessage(testUser);

		testUser.hero.currentHealth -= 50;
		await testUser.save();
		const heroHpBefore = testUser.hero.currentHealth;
		const heroPotionsBefore = testUser.hero.inventory["Small Healing Potion"];

		const result = await useCommand.execute(mockMessage, ["yolo"], testUser);

		expect(typeof result).to.be.equal("string");
		expect(/There are no consumables called/gi.test(result)).to.be.equal(true);
		expect(testUser.hero.currentHealth).to.be.equal(heroHpBefore);
		expect(testUser.hero.currentHealth).to.not.equal(testUser.hero.health);
		expect(testUser.hero.inventory["Small Healing Potion"]).to.be.equal(heroPotionsBefore);
		expect(typeof testUser.hero.inventory["Small Healing Potion"]).to.be.equal("number");
	});

	it("should be denied if hero has full hp", async ()=>{
		const testUser = await createTestUser();
		const mockMessage = generateDiscordMessage(testUser);

		testUser.hero.currentHealth = testUser.hero.health;
		await testUser.save();

		const heroHpBefore = testUser.hero.currentHealth;
		const heroPotionsBefore = testUser.hero.inventory["Small Healing Potion"];

		const result = await useCommand.execute(mockMessage, ["small", "healing", "potion"], testUser);

		expect(typeof result).to.be.equal("string");
		expect(/You already have full health/gi.test(result)).to.be.equal(true);
		expect(testUser.hero.currentHealth).to.be.equal(heroHpBefore);
		expect(testUser.hero.currentHealth).to.be.equal(testUser.hero.health);
		expect(testUser.hero.inventory["Small Healing Potion"]).to.be.equal(heroPotionsBefore);
		expect(typeof testUser.hero.inventory["Small Healing Potion"]).to.be.equal("number");
	});

	it("should heal hero hp if potion is used", async ()=>{
		const testUser = await createTestUser();
		const mockMessage = generateDiscordMessage(testUser);
		testUser.hero.currentHealth -= 50;
		await testUser.save();
		const heroHpBefore = testUser.hero.currentHealth;

		useCommand.execute(mockMessage, ["small", "healing", "potion"], testUser);
		expect(testUser.hero.currentHealth).to.be.equal(heroHpBefore + 50);
	});

	it("should remove healing potion if used", async ()=>{
		const testUser = await createTestUser();
		const mockMessage = generateDiscordMessage(testUser);
		testUser.hero.currentHealth -= 50;
		await testUser.save();
		const potionBefore = testUser.hero.inventory["Small Healing Potion"];

		useCommand.execute(mockMessage, ["small", "healing", "potion"], testUser);
		expect(potionBefore).to.be.equal(testUser.hero.inventory["Small Healing Potion"] + 1);
	});
});