// How to use advancedCombat
// await createCombatRound(message, progress);

// This object is needed and will be used for the whole combat process. Not all fields are needed
// The object will be returned with aditional values when combat is ober

/*
const progress = {
	combatRules:{ // REQUIRED <Object> sets combat rules
		armyAllowed: false, // REQUIRED <Boolean> toggles use of army
		maxRounds: 3 // REQUIRED <Number> Maximum rounds of combat before it ends (or stopped by someone winning)
	},
	teamGreen:[user, user2, npc], // REQUIRED <Array> Array of objects. Either NPC object or user object from db
	teamRed:[user3, npc, npc], // REQUIRED <Array> Array of objects. Either NPC object or user object from db
	embedInformation:{ // REQUIRED <Object> Sets the embed to be shown during combat
		minimalEmbed: false, // not required <Boolean> Toggle this to slim down the embed
		teamRedName:"", // not required <String> Name of the red Team -> Default is "Team Red"
		teamGreenName:"", // not required <String> Name of the green Team -> Default is "Team Green"
		title:"", // not required <String> Title of the battle -> Default is "BATTLE!"
		description:"", // not required <String> Description of battle -> Default is ""
		fields:[], // not required <Array> Aditional fields to the embed -> Default is []
		footer:"", // not required <String> Sets the footer -> Default is "TIP: Write your weapon of choice in the chat. eg -> a or c"
	}
};


// The NPC needs to be formatted like the object underneath
const npc = {
	name: "John Doe", // REQUIRED <String> Name of the NPC
	stats: { // REQUIRED <Object> stats of the NPC
		attack: 25, // REQUIRED <Number> attack stats
		health: 100, // REQUIRED <Number> health stats
	},
	allowedNumOfAttacks: 2, // not required <Number> number of times the NPC is allowed to attack each round -> Default is 1
    weapons: ["slash", "strike", "poke"], // not required <Array> list of weapons the npc carries. All weapons must be available in the weapon object -> Default is whatever the players have access to
    army: { // not required <Object> the army the npc have
        units: { // not required <Object> units in army
			archery: {}, // not required <Object> units from archery eg. {huntsman: 10} -> default 0
			barracks: {} // not required <Object> units from barrack eg. {militia: 5} -> default 0
		}
	};
};
*/
