/* eslint-disable no-undef */

const { expect } = require("chai");
const User = require("../../models/User");
const Lottery = require("../../models/Lottery");
const lotteryCommand = require("../../commands/lottery");
const buyCommand = require("../../commands/buy");
const { createTestUser, generateDiscordMessage } = require("../helper");

const empire = [{ name : "shop", level : 2 }];


describe("lottery command", () => {
	beforeEach("beforeEach, cleaning db", async () => {
		await User.deleteMany();
		await Lottery.deleteMany();
	});
	it("lottery command should exist", () => {
		expect(lotteryCommand).to.not.equal(undefined);
	});
	it("should create a lottery when command is called", async () => {
		const testUser = await createTestUser();
		const mockMessage = generateDiscordMessage(testUser);
		const lotteryBeforeCreating = await Lottery.find().lean();
		expect(lotteryBeforeCreating.length).to.equal(0);
		const result = await lotteryCommand.execute(mockMessage, null, testUser);
		const lotteryAfterCreating = await Lottery.find().lean();
		expect(lotteryAfterCreating.length).to.equal(1);
		expect(result.title).to.have.string(":money_with_wings: **LOTTERY** :money_with_wings:");
		expect(result.fields[1].name).to.have.string("Current contestors:");
		expect(result.fields[1].value).to.have.string("None");
		expect(result.footer.text).to.have.string("How to buy tickets: !buy lottery 5");
	});
	it("should not be able to buy lottery without gold", async () => {
		const testUser = await createTestUser({ resources:{ gold:50 } });
		const mockMessage = generateDiscordMessage(testUser);
		await lotteryCommand.execute(mockMessage, null, testUser);
		const result = await buyCommand.execute(mockMessage, ["lottery", "5"], testUser);
		expect(result).to.have.string("Insufficent funds!");
		const lottery = await Lottery.find().lean();
		expect(lottery[0].currentContestors.length).to.equal(0);
	});
	it("should not be able to buy lottery without shop level 2", async () => {
		const testUser = await createTestUser({ resources:{ gold: 5000 } });
		const mockMessage = generateDiscordMessage(testUser);
		await lotteryCommand.execute(mockMessage, null, testUser);
		const result = await buyCommand.execute(mockMessage, ["lottery", "5"], testUser);
		expect(result).to.have.string("You need shop level 2 to buy lottery tickets");
		const lottery = await Lottery.find().lean();
		expect(lottery[0].currentContestors.length).to.equal(0);
	});
	it("should be able to buy lottery tickets", async () => {
		const testUser = await createTestUser({ resources:{ gold:500 }, empire });
		const mockMessage = generateDiscordMessage(testUser);
		await lotteryCommand.execute(mockMessage, null, testUser);
		const result = await buyCommand.execute(mockMessage, ["lottery", "5"], testUser);
		expect(result.title).to.have.string(`:money_with_wings: ${testUser.account.username} purchased 5 lottery tickets! :money_with_wings:`);
		const lottery = await Lottery.find().lean();
		expect(lottery[0].currentContestors.length).to.equal(1);
		expect(lottery[0].currentContestors[0].username).to.equal(testUser.account.username);
		expect(lottery[0].currentContestors[0].userid).to.equal(testUser.account.userid);
		expect(lottery[0].currentContestors[0].ticketAmount).to.equal(5);
		expect(lottery[0].prizePool.gold).to.equal(700);
		expect(testUser.resources.gold).to.equal(100);
	});
	it("should not be able to buy too many tickets", async () => {
		const testUser = await createTestUser({ resources:{ gold:200000 }, empire });
		const mockMessage = generateDiscordMessage(testUser);
		await lotteryCommand.execute(mockMessage, null, testUser);
		const result = await buyCommand.execute(mockMessage, ["lottery", "101"], testUser);
		expect(result).to.have.string("Max 100 tickets can be purchased for each lottery raffle");
		const lottery = await Lottery.find().lean();
		expect(lottery[0].currentContestors.length).to.equal(0);
	});
	it("should show chance based upon how many people participating", async () => {
		const testUser = await createTestUser({ resources:{ gold:1000 }, empire });
		const testUser2 = await createTestUser({ account:{ username:"Jarle Moe" }, resources:{ gold:1000 }, empire });
		const mockMessage = generateDiscordMessage(testUser);
		const mockMessage2 = generateDiscordMessage(testUser2);
		await buyCommand.execute(mockMessage, ["lottery", "1"], testUser);
		await buyCommand.execute(mockMessage2, ["lottery", "2"], testUser2);
		const result = await lotteryCommand.execute(mockMessage, null, testUser);
		const chanceNumbers = result.fields[1].value.split("\n").map(fieldValue => fieldValue.match(/\d+/)[0]);
		expect(chanceNumbers[0]).to.equal("33");
		expect(chanceNumbers[1]).to.equal("66");
	});
	it("should reward player upon win", async () => {
		const testUser = await createTestUser({ resources:{ gold:500 }, empire });
		const mockMessage = generateDiscordMessage(testUser);
		await lotteryCommand.execute(mockMessage, null, testUser);
		await buyCommand.execute(mockMessage, ["lottery", "1"], testUser);
		const lotteries = await Lottery.find().lean();
		const lotteryBefore = await Lottery.findById(lotteries[0]);
		lotteryBefore.nextDrawing = new Date("2020-01-01T10:00:00.208+0000");
		await lotteryBefore.save();
		await lotteryCommand.execute(mockMessage, null, testUser);
		const updatedUser = await User.findOne({ id:testUser.account.userid });
		expect(updatedUser.resources.gold).to.equal(800);

	});
	it("should show previous winner", async () => {
		const testUser = await createTestUser({ resources:{ gold:500 }, empire });
		const mockMessage = generateDiscordMessage(testUser);
		await lotteryCommand.execute(mockMessage, null, testUser);
		await buyCommand.execute(mockMessage, ["lottery", "1"], testUser);
		const lotteries = await Lottery.find().lean();
		const lotteryBefore = await Lottery.findById(lotteries[0]);
		lotteryBefore.nextDrawing = new Date("2020-01-01T10:00:00.208+0000");
		await lotteryBefore.save();
		const result = await lotteryCommand.execute(mockMessage, null, testUser);
		expect(result.fields[0].value).to.have.string(`${testUser.account.username} (100.0% chance)\n :moneybag: 380`);
	});
});
