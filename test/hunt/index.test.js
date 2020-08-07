/* eslint-disable no-undef */

const { expect } = require("chai");
const User = require("../../models/User");
const huntCommand = require("../../commands/hunt");
const { createTestUser, generateDiscordMessage, mockDays } = require("../helper");


describe("hunt command", () => {
	beforeEach("beforeEach, cleaning db", async ()=>{
		await User.deleteMany();
	});
	it("should exist", () => {
		expect(huntCommand).to.not.equal(undefined);
	});
	it("should not be able if no hunting places explored", async ()=>{
		const testUser = await createTestUser();
		const mockMessage = generateDiscordMessage(testUser);
		const result = await huntCommand.execute(mockMessage, [], testUser);
		expect(result).to.be.equal("You have not explored any place to hunt in :deciduous_tree: Grassy Plains, try `!explore` to find a place to hunt");
	});
	it("should run into cooldown if triggered too fast", async ()=>{
		const testUser = await createTestUser({ world:{ locations:{ "Grassy Plains":{ explored:["Forest"] } } } });
		const mockMessage = generateDiscordMessage(testUser);
		await huntCommand.execute(mockMessage, [], testUser);
		const result = await huntCommand.execute(mockMessage, [], testUser);
		expect(result.title).to.be.equal("Cooldown");
	});
	it("should not be able to hunt if health is too low", async ()=>{
		const testUser = await createTestUser({ hero:{ currentHealth:0 } });
		const mockMessage = generateDiscordMessage(testUser);
		const result = await huntCommand.execute(mockMessage, [], testUser);
		expect(result).to.have.string("Your hero's health is too low (**0**)");
	});
	it("should not be able to hunt a raiding, dungeon or miniboss place", async ()=>{
		const places = ["Collapsed Mine", "Forest"];
		const testUser = await createTestUser({ world:{ locations:{ "Grassy Plains":{ explored:places } } } });
		const mockMessage = generateDiscordMessage(testUser);
		const result = await huntCommand.execute(mockMessage, [places[0]], testUser);
		expect(result).to.be.equal("This place cannot be hunted");
	});
	it("should not be able to hunt a place even though the player knows the name", async ()=>{
		const unknownPlace = "Forest";
		const testUser = await createTestUser({ world:{ locations:{ "Grassy Plains":{ explored:["Cave"] } } } });
		const mockMessage = generateDiscordMessage(testUser);
		const result = await huntCommand.execute(mockMessage, [unknownPlace], testUser);
		expect(result).to.be.equal("You haven't explored this place yet. Try `!explore` in order to find it!");
	});
	it("should be able to hunt if a hunting place is explored", async ()=>{
		const testUser = await createTestUser({ hero:{ currentHealth:500, health:500, attack:500 }, world:{ locations:{ "Grassy Plains":{ explored:["Cave", "Forest"] } } } });
		const mockMessage = generateDiscordMessage(testUser);
		const result = await huntCommand.execute(mockMessage, [], testUser);
		expect(result.title).to.have.string("Anniken Avisbud's hero hunted :frog:");
		await testUser.setNewCooldown("hunt", mockDays(1));
		testUser.hero.currentHealth = testUser.hero.health;
		await testUser.save();
		const result2 = await huntCommand.execute(mockMessage, ["Cave"], testUser);
		expect(result2.title).to.be.equal("Anniken Avisbud's hero hunted :frog: Cave");

	});
	it("should gain resources when when hunting successfully", async ()=>{
		const testUser = await createTestUser({ world:{ locations:{ "Grassy Plains":{ explored:["Cave"] } } }, resources:{ gold:0 }, hero:{ currentHealth:500, health:500, attack:500 } });
		const mockMessage = generateDiscordMessage(testUser);

		for (let i = 0; i < 5; i++) {
			await huntCommand.execute(mockMessage, [], testUser);
			await testUser.setNewCooldown("hunt", mockDays(i + 1));
		}
		expect(testUser.resources.gold).to.not.equal(0);
	});


});

