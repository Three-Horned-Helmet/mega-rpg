/* eslint-disable no-undef */

const { expect } = require("chai");
const User = require("../../models/User");
const destroyCommand = require("../../commands/destroy");
const { destroyHandler, checkIfDestroyIsPossible } = require("../../game/destroy/destroy");
const { createTestUser, generateDiscordMessage } = require("../helper");

const empire = [
	{
		name: "barracks",
		level: 0,
		position: [0, 0]
	}
];


describe("destroy commands", () => {
	beforeEach("beforeEach, cleaning db", async ()=>{
		await User.deleteMany();
	});

	it("destroy command should exist", () => {
		expect(destroyCommand).to.not.equal(undefined);
	});

	it("destroy handler should exist", () => {
		expect(destroyHandler).to.not.equal(undefined);
	});

	it("checkIfDestroyIsPossible should exist", () => {
		expect(checkIfDestroyIsPossible).to.not.equal(undefined);
	});

	it("should be denied if the arguments match no buildings of the user", async ()=>{
		const testUser = await createTestUser({ empire });
		const result = checkIfDestroyIsPossible(testUser, "yolo");
		expect(result.message).to.be.equal("There are no buildings with the coordinates or name 'yolo' in your empire.");
		expect(result.response).to.be.equal(false);
	});

	it("should be denied if the argument coordinates match no building coordinates of the user", async ()=>{
		const testUser = await createTestUser({ empire });
		const result = checkIfDestroyIsPossible(testUser, "1.1");
		expect(result.message).to.be.equal("There are no buildings with the coordinates or name '1.1' in your empire.");
		expect(result.response).to.be.equal(false);
	});

	it("should be denied if the argument name match no building name of the user", async ()=>{
		const testUser = await createTestUser({ empire });
		const result = checkIfDestroyIsPossible(testUser, "farm");
		expect(result.message).to.be.equal("There are no buildings with the coordinates or name 'farm' in your empire.");
		expect(result.response).to.be.equal(false);
	});

	it("should have barracks at position 0.0 as default for testUser", async ()=>{
		const testUser = await createTestUser();

		expect(testUser.empire.length).to.be.equal(0);
	});

	it("should remove a building if the correct coordinates are applied", async ()=>{
		const testUser = await createTestUser({ empire: [
			{
				name: "barracks",
				level: 0,
				position: [0, 0]
			}
		] });

		const mockMessage = generateDiscordMessage(testUser);
		await destroyCommand.execute(mockMessage, ["0.0"], testUser);

		expect(testUser.empire.length).to.be.equal(0);
	});

	it("should remove a building if the correct name is applied", async ()=>{
		const testUser = await createTestUser({ empire: [
			{
				name: "barracks",
				level: 0,
				position: [0, 0]
			}
		] });

		const mockMessage = generateDiscordMessage(testUser);

		await destroyCommand.execute(mockMessage, ["barracks"], testUser);

		expect(testUser.empire.length).to.be.equal(0);
	});

	it("should not remove building if no arguments are applied", async ()=>{
		const testUser = await createTestUser({ empire: [
			{
				name: "barracks",
				level: 0,
				position: [0, 0]
			}
		] });

		const mockMessage = generateDiscordMessage(testUser);

		await destroyCommand.execute(mockMessage, [], testUser);

		expect(testUser.empire.length).to.be.equal(1);
	});

	it("should not remove building if incorrect name is applied", async ()=>{
		const testUser = await createTestUser({ empire: [
			{
				name: "barracks",
				level: 0,
				position: [0, 0]
			}
		] });

		const mockMessage = generateDiscordMessage(testUser);

		await destroyCommand.execute(mockMessage, ["farm"], testUser);

		expect(testUser.empire.length).to.be.equal(1);
	});
});
