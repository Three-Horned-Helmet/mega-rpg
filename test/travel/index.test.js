/* eslint-disable no-undef */

const { expect } = require("chai");
const User = require("../../models/User");
const travelCommand = require("../../commands/travel");
const { createTestUser, generateDiscordMessage } = require("../helper");
const { getIcon } = require("../../game/_CONSTS/icons");
const { worldLocations } = require("../../game/_UNIVERSE");

const defaultLocations = {
	currentLocation : "Grassy Plains",
	locations: {
		"Grassy Plains" : { available : true },
		"Misty Mountains" : { available : false },
		"Deep Caves" : { available : false }
	} };
const allLocationsAvailable = {
	currentLocation : "Grassy Plains",
	locations:{
		"Grassy Plains" : { available : true },
		"Misty Mountains" : { available : true },
		"Deep Caves" : { available : true }
	} };

// 15.10.2021

const locationNames = Object.keys(defaultLocations.locations);

const getRandomElementFromArray = (array) => array[Math.floor(Math.random() * array.length)];

describe("travel command", () => {
	beforeEach("beforeEach, cleaning db", async ()=>{
		await User.deleteMany();
	});
	it("should exist", () => {
		expect(travelCommand).to.not.equal(undefined);
	});
	it("should not be able to travel if no desitination is provided", async ()=>{
		const testUser = await createTestUser({ world: defaultLocations });
		const mockMessage = generateDiscordMessage(testUser);
		const result = await travelCommand.execute(mockMessage, [], testUser);
		expect(result).to.be.equal("Where do you want to travel to?");
		expect(testUser.world.currentLocation).to.equal("Grassy Plains");
	});
	it("should not be able to travel if no other destinations are explored", async ()=>{
		const testUser = await createTestUser({ world: defaultLocations });
		const mockMessage = generateDiscordMessage(testUser);
		await travelCommand.execute(mockMessage, [], testUser);
		const result = await travelCommand.execute(mockMessage, ["Misty Mountains"], testUser);
		expect(result).to.be.equal(`You haven't unlocked anything but ${getIcon("Grassy Plains")} ${"Grassy Plains"}`);
		expect(testUser.world.currentLocation).to.equal("Grassy Plains");
	});
	it("should not be able to travel to a destinations that isn't unlocked", async ()=>{
		const testUser = await createTestUser({ world: { locations:
            { "Grassy Plains" : { available : true }, "Misty Mountains" : { available : true }, "Deep Caves" : { available : false }
            } } });
		const mockMessage = generateDiscordMessage(testUser);
		const result = await travelCommand.execute(mockMessage, ["Deep Caves"], testUser);
		expect(result).to.have.string("You can't travel there. Try `!look` to see your available locations - if any..");
		expect(testUser.world.currentLocation).to.equal("Grassy Plains");
	});
	it("should not be able to travel to a destinations that doesn't exist", async ()=>{
		const testUser = await createTestUser({ world: allLocationsAvailable });
		const mockMessage = generateDiscordMessage(testUser);
		const result = await travelCommand.execute(mockMessage, ["Hundremeterskogen"], testUser);
		expect(result).to.have.string("You can't travel there. Try `!look` to see your available locations - if any..");
		expect(testUser.world.currentLocation).to.equal("Grassy Plains");
	});
	it("Should be able to travel to other explored destinations", async () => {
		const testUser = await createTestUser({ world:allLocationsAvailable });
		const mockMessage = generateDiscordMessage(testUser);
		const travelMountainsResult = await travelCommand.execute(mockMessage, [locationNames[1]], testUser);
		expect(travelMountainsResult).to.be.equal(`You traveled to ${getIcon(locationNames[1])} ${locationNames[1]}\n${worldLocations[locationNames[1]].description}`);
		expect(testUser.world.currentLocation).to.equal("Misty Mountains");
		const travelDeepCavesResult = await travelCommand.execute(mockMessage, [locationNames[2]], testUser);
		expect(travelDeepCavesResult).to.be.equal(`You traveled to ${getIcon(locationNames[2])} ${locationNames[2]}\n${worldLocations[locationNames[2]].description}`);
		expect(testUser.world.currentLocation).to.equal("Deep Caves");
		const travelGrassyResult = await travelCommand.execute(mockMessage, [locationNames[0]], testUser);
		expect(travelGrassyResult).to.be.equal(`You traveled to ${getIcon(locationNames[0])} ${locationNames[0]}\n${worldLocations[locationNames[0]].description}`);
		expect(testUser.world.currentLocation).to.equal("Grassy Plains");
	});
	it("Should be able to use shortcuts to travel", async ()=>{
		const testUser = await createTestUser({ world:allLocationsAvailable });
		const mockMessage = generateDiscordMessage(testUser);
		const mountainShortCut = getRandomElementFromArray(worldLocations["Misty Mountains"].shortcuts);
		const travelMountainsResult = await travelCommand.execute(mockMessage, [mountainShortCut], testUser);
		expect(travelMountainsResult).to.be.equal(`You traveled to ${getIcon(locationNames[1])} ${locationNames[1]}\n${worldLocations[locationNames[1]].description}`);
		expect(testUser.world.currentLocation).to.equal("Misty Mountains");
		const deepCavesShortCut = getRandomElementFromArray(worldLocations["Deep Caves"].shortcuts);
		const travelDeepCavesResult = await travelCommand.execute(mockMessage, [deepCavesShortCut], testUser);
		expect(travelDeepCavesResult).to.be.equal(`You traveled to ${getIcon(locationNames[2])} ${locationNames[2]}\n${worldLocations[locationNames[2]].description}`);
		expect(testUser.world.currentLocation).to.equal("Deep Caves");
		const grassyShortCut = getRandomElementFromArray(worldLocations["Grassy Plains"].shortcuts);
		const travelGrassyResult = await travelCommand.execute(mockMessage, [grassyShortCut], testUser);
		expect(travelGrassyResult).to.be.equal(`You traveled to ${getIcon(locationNames[0])} ${locationNames[0]}\n${worldLocations[locationNames[0]].description}`);
		expect(testUser.world.currentLocation).to.equal("Grassy Plains");
	});
});

/* LOOK INTO USER */