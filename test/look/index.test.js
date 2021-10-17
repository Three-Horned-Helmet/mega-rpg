/* eslint-disable no-undef */

const { expect } = require("chai");
const User = require("../../models/User");
const lookCommand = require("../../commands/look");
const { createTestUser, generateDiscordMessage } = require("../helper");
const explored = [
	"River",
	"Fishing village",
	"Collapsed Mine",
	"C'Thun",
	"Cave",
	"Bandit Camp",
	"Bandit's Mansion",
	"Hills"
];
const world = {
	world: {
		locations: {
			"Grassy Plains": {
				explored
			}
		}
	}
};

describe("look command", () => {
	beforeEach("beforeEach, cleaning db", async () => {
		await User.deleteMany();
	});
	it("look command should exist", () => {
		expect(lookCommand).to.not.equal(undefined);
	});
	it("should show tip information if nothing explored", async () => {
		const testUser = await createTestUser();
		const mockMessage = generateDiscordMessage(testUser);
		const result = await lookCommand.execute(mockMessage, null, testUser);
		expect(result.title).to.be.equal(`${testUser.account.username}'s world`);
		expect(result.fields[2].value).to.be.equal("You have not explored anything in Grassy Plains\ntry: ```!explore```");
	});
	it("should only show places that has been explored", async () => {
		const testUser = await createTestUser(world);
		const mockMessage = generateDiscordMessage(testUser);
		const result = await lookCommand.execute(mockMessage, null, testUser);
		expect(explored.every(location => result.fields[2].value.includes(location))).to.be.equal(true);
		expect(result.fields[2].value).to.not.include("Forest");
	});
	it("should provide icons for every explored location", async () => {
		const testUser = await createTestUser(world);
		const mockMessage = generateDiscordMessage(testUser);
		const result = await lookCommand.execute(mockMessage, null, testUser);
		const resultLocations = result.fields[2].value.split("\n");
		const iconRegex = /^:.*:$/;
		resultLocations.every(location => expect(iconRegex.test(location.split(" ")[0])));
	});
	it("should show difficulties for raid and hunting places", async () => {
		const testUser = await createTestUser(world);
		const mockMessage = generateDiscordMessage(testUser);
		const result = await lookCommand.execute(mockMessage, null, testUser);
		const resultLocations = result.fields[2].value.split("\n");
		const fishingVillage = resultLocations.find(location => location.includes("Fishing village"));
		const river = resultLocations.find(location => location.includes("River"));
		const banditCamp = resultLocations.find(location => location.includes("Bandit Camp"));
		const skullIcon = ":skull_crossbones:";
		expect(fishingVillage).to.have.string(skullIcon);
		expect(banditCamp).to.have.string(skullIcon);
		expect(river).to.not.have.string(skullIcon);
		const getNumberOfSkulls = location => location.split(skullIcon).length;
		expect(getNumberOfSkulls(fishingVillage) < getNumberOfSkulls(banditCamp)).to.be.equal(true);
	});
});
