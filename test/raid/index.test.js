/* eslint-disable no-undef */

const { expect } = require("chai");
const raidCommand = require("../../commands/raid");
const { createTestUser, generateDiscordMessage, mockDays } = require("../helper");

const opTestStats = {
	hero:{
		currentHealth:500, health:500, attack:500,
	},
	world:{
		locations:{
			"Grassy Plains":{
				explored:["Collapsed Mine", "Bandit Camp"],
			},
		},
	},
	army: {
		units:{
			archery:{
				ranger:500,
			},
		},
	},
};


describe("raid command", () => {

	it("should exist", () => {
		expect(raidCommand).to.not.equal(undefined);
	});
	it("should not be able if no raiding places explored", async ()=>{
		const testUser = await createTestUser();
		const mockMessage = generateDiscordMessage(testUser);
		const result = await raidCommand.execute(mockMessage, [], testUser);
		expect(result).to.be.equal("You have not explored any place to raid in :deciduous_tree: Grassy Plains, try `!explore` to find a place to raid");
	});
	it("should run into cooldown if triggered too fast", async ()=>{
		const testUser = await createTestUser({ world:{ locations:{ "Grassy Plains":{ explored:["Bandit Camp"] } } } });
		const mockMessage = generateDiscordMessage(testUser);
		await raidCommand.execute(mockMessage, [], testUser);
		const result = await raidCommand.execute(mockMessage, [], testUser);
		expect(result.title).to.be.equal("Cooldown");
	});
	it("should not be able to hunt if health is too low", async ()=>{
		const testUser = await createTestUser({ hero:{ currentHealth:0 } });
		const mockMessage = generateDiscordMessage(testUser);
		const result = await raidCommand.execute(mockMessage, [], testUser);
		expect(result).to.have.string("Your hero's health is too low (**0**)");
	});
	it("should not be able to raid a hunting, dungeon or miniboss place", async ()=>{
		const places = ["Collapsed Mine", "Forest"];
		const testUser = await createTestUser({ world:{ locations:{ "Grassy Plains":{ explored:places } } } });
		const mockMessage = generateDiscordMessage(testUser);
		const result = await raidCommand.execute(mockMessage, [places[1]], testUser);
		expect(result).to.be.equal("This place cannot be raided");
	});
	it("should not be able to raid a place even though the player knows the name", async ()=>{
		const unknownPlace = "Bandit Camp";
		const testUser = await createTestUser({ world:{ locations:{ "Grassy Plains":{ explored:["Collapsed Mine"] } } } });
		const mockMessage = generateDiscordMessage(testUser);
		const result = await raidCommand.execute(mockMessage, [unknownPlace], testUser);
		expect(result).to.be.equal("You haven't explored this place yet. Try `!explore` in order to find it!");
	});
	it("should be able to raid if a raiding place is explored", async ()=>{
		const testUser = await createTestUser(opTestStats);
		const mockMessage = generateDiscordMessage(testUser);
		const result = await raidCommand.execute(mockMessage, [], testUser);
		expect(result.title).to.have.string("Anniken Avisbud's army raided :man_supervillain:");
		await testUser.setNewCooldown("raid", mockDays(1));
		testUser.hero.currentHealth = testUser.hero.health;
		await testUser.save();
		const result2 = await raidCommand.execute(mockMessage, ["Bandit Camp"], testUser);
		expect(result2.title).to.be.equal("Anniken Avisbud's army raided :man_supervillain: Bandit Camp");

	});
	it("should gain resources when when raiding successfully", async ()=>{
		const testUser = await createTestUser(opTestStats);
		const mockMessage = generateDiscordMessage(testUser);

		for (let i = 0; i < 5; i++) {
			await raidCommand.execute(mockMessage, [], testUser);
			await testUser.setNewCooldown("hunt", mockDays(i + 1));
		}
		expect(testUser.resources.gold).to.not.equal(0);
	});
});
