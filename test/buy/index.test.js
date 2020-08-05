/* eslint-disable no-undef */

const { expect } = require("chai");
const User = require("../../models/User");
const buyCommand = require("../../commands/buy");
const { displayShop, handleBuyCommand } = require("../../game/buy/buy-item");
const consumablesObject = require("../../game/use/consumables-object")
const { createTestUser, generateDiscordMessage } = require("../helper");


describe("buy commands", () => {
	beforeEach("beforeEach, cleaning db", async ()=>{
		await User.deleteMany();
	});

	it("buy command should exist", () => {
		expect(buyCommand).to.not.equal(undefined);
	});

	it("buy handler should exist", () => {
		expect(handleBuyCommand).to.not.equal(undefined);
    });
    
	it("displayShop should exist", () => {
		expect(displayShop).to.not.equal(undefined);
	});

	it("should be denied if the arguments match no consumables", async ()=>{
		const testUser = await createTestUser();
		const result = handleBuyCommand("yolo", testUser);
		expect(result.response).to.be.equal(false);
	});

	it("should get 1 healing potion if the conditions are met", async ()=>{
		const testUser = await createTestUser();
		const mockMessage = generateDiscordMessage(testUser);

		const currentHealingPots = user.hero.inventory["small healing potion"]
		buyCommand.execute(mockMessage, ["small", "healing", "potion"], testUser);
		expect(testUser.hero.inventory["small healing potion"]).to.be.equal(currentHealingPots + 1);
	});

	it("amount of potions in user should remain a number after buying a potion", async ()=>{
		const testUser = await createTestUser();
		const mockMessage = generateDiscordMessage(testUser);

		buyCommand.execute(mockMessage, ["small", "healing", "potion"], testUser);
		expect(typeof testUser.hero.inventory["small healing potion"]).to.be.equal("number");
	});

	it("should decrease the users gold after purchase", async ()=>{
		const testUser = await createTestUser();
		const mockMessage = generateDiscordMessage(testUser);

		const userGoldBeforePurchase = testUser.resources.gold
		const consumable = consumablesObject["Small Healing Potion"]
		buyCommand.execute(mockMessage, ["small", "healing", "potion"], testUser);
		expect(testUser.resources.gold).to.be.equal(userGoldBeforePurchase - consumable.price);
	});

	it("should get 5 healing potion if several is bought", async ()=>{
		const testUser = await createTestUser();
		const mockMessage = generateDiscordMessage(testUser);

		const currentHealingPots = user.hero.inventory["small healing potion"]
		buyCommand.execute(mockMessage, ["small", "healing", "potion", "3"], testUser);
		expect(testUser.hero.inventory["small healing potion"]).to.be.equal(currentHealingPots + 3);
	});

	it("should decrease the users gold after purchase of several potions", async ()=>{
		const testUser = await createTestUser();
		const mockMessage = generateDiscordMessage(testUser);

		const userGoldBeforePurchase = testUser.resources.gold
		const consumable = consumablesObject["Small Healing Potion"]
		buyCommand.execute(mockMessage, ["small", "healing", "potion", "3"], testUser);
		expect(testUser.resources.gold).to.be.equal(userGoldBeforePurchase - consumable.price*3);
	});

	it("should remain a number after purchase of several potions", async ()=>{
		const testUser = await createTestUser();
		const mockMessage = generateDiscordMessage(testUser);

		buyCommand.execute(mockMessage, ["small", "healing", "potion", "2"], testUser);
		expect(typeof testUser.hero.inventory["small healing potion"]).to.be.equal("number");
	});
});