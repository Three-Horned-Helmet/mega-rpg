/* eslint-disable no-undef */

const { expect } = require("chai");
const User = require("../../models/User");
const exploreCommand = require("../../commands/explore");
const { createTestUser, generateDiscordMessage } = require("../helper");
const { worldLocations } = require("../../game/_UNIVERSE");


describe("explore command", () => {
	beforeEach("beforeEach, cleaning db", async () => {
		await User.deleteMany();
	});
	it("should exist", () => {
		expect(exploreCommand).to.not.equal(undefined);
	});
	it("should run into cooldown if triggered too fast", async () => {
		const testUser = await createTestUser();
		const mockMessage = generateDiscordMessage(testUser);
		const result = await exploreCommand.execute(mockMessage, null, testUser);
		const result2 = await exploreCommand.execute(mockMessage, null, testUser);
		expect(typeof result).to.be.equal("string");
		expect(result2.title).to.be.equal("Cooldown");
		expect(result2.fields[0].name).to.have.string("You can't use this command ");

	});

	it("should have instance of newly explored places in user", async () => {
		const users = [];
		const mockMessages = [];
		const results = [];

		for (let i = 0; i < 10; i += 1) {
			users.push(createTestUser());
		}

		const allUsers = await Promise.all(users);

		for (let i = 0; i < 10; i += 1) {
			mockMessages.push(generateDiscordMessage(allUsers[i]));
			results.push(await exploreCommand.execute(mockMessages[i], null, allUsers[i]));
		}

		let howManyPlacesFound = 0;
		allUsers.forEach(d => {
			howManyPlacesFound += d.world.locations["Grassy Plains"].explored.length;
		});
		expect(howManyPlacesFound).to.not.be.equal(0);
		expect(howManyPlacesFound).to.be.above(3);
	});
	it("should not add more places if everything is explored", async () => {
		const allPlaces = Object.keys(worldLocations["Grassy Plains"].places);
		const users = [];
		const mockMessages = [];
		const results = [];
		const world = {
			locations: {
				"Grassy Plains": {
					explored: [
						...allPlaces,
					],
				},
			},
		};

		for (let i = 0; i < 10; i += 1) {
			users.push(createTestUser({ world }));
		}

		const allUsers = await Promise.all(users);

		// ensure that all places has safely been placed into all users
		allUsers.forEach(u => {
			expect(u.world.locations["Grassy Plains"].explored.length).to.be.equal(allPlaces.length);
		});

		for (let i = 0; i < 10; i += 1) {
			mockMessages.push(generateDiscordMessage(allUsers[i]));
			results.push(await exploreCommand.execute(mockMessages[i], null, allUsers[i]));
		}

		// counts each user after exploring one time
		allUsers.forEach(u => {
			expect(u.world.locations["Grassy Plains"].explored.length).to.be.equal(allPlaces.length);
		});
	});
});

