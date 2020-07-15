/* eslint-disable no-undef */

const { expect } = require("chai");
const User = require("../../models/User");
const fishingCommand = require("../../commands/fish");
const { createTestUser, generateDiscordMessage, mockDays } = require("../helper");


describe("fish commands", () => {
	beforeEach("beforeEach, cleaning db", async ()=>{
		await User.deleteMany();
	});
	it("fishing should exist", () => {
		expect(fishingCommand).to.not.equal(undefined);
	});
	it("should be denied if fishing place is not explored", async ()=>{
		const testUser = await createTestUser();
		const mockMessage = generateDiscordMessage(testUser);
		const result = await fishingCommand.execute(mockMessage, null, testUser);

		expect(result).to.be.equal("You haven't found any place to :blowfish: fish in :deciduous_tree: Grassy Plains");
	});

	it("should run into cooldown if triggered too fast", async ()=>{
		const testUser = await createTestUser({ world:{ locations:{ "Grassy Plains":{ explored:["River"] } } } });
		const mockMessage = generateDiscordMessage(testUser);
		await fishingCommand.execute(mockMessage, null, testUser);
		const result = await fishingCommand.execute(mockMessage, null, testUser);
		expect(result.title).to.be.equal("Cooldown");
	});
	it("should make money after fishing many times", async ()=>{
		const testUser = await createTestUser({ resources:{ gold:0 }, world:{ locations:{ "Grassy Plains":{ explored:["River"] } } } });
		const mockMessage = generateDiscordMessage(testUser);

		for (let i = 0; i < 10; i++) {
			await fishingCommand.execute(mockMessage, null, testUser);
			await testUser.setNewCooldown("fish", mockDays(i + 1));
		}
		expect(testUser.resources.gold).to.not.equal(0);
	});
});
