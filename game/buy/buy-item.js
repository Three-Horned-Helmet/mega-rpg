const consumeObj = require("../use/consumables-object");
const { getIcon } = require("../_CONSTS/icons");

// Runs functions depending on the given args
const handleBuyCommand = async (args, user, amount) =>{
	if(args.length === 0) {
		const message = displayShop(user);
		return message;
	}

	const joinedArg = args
		.filter(a => typeof a === "string" && isNaN(a))
		.map(a => a.charAt(0).toUpperCase() + a.slice(1).toLowerCase()).join(" ");
	const item = consumeObj[joinedArg];

	const message = await buyItem(user, item, amount);

	return message;
};

// Show all items in the shop and their price
const displayShop = (user) =>{
	let message = "Try `!buy <itemName>` to buy an item.\n\n Available items: \n";
	let noItems = true;

	Object.values(consumeObj).forEach(item =>{
		const { building, level } = item.requirement;
		if(user.empire.find(b => b.name === building && b.level >= level)) {
			message += `${getIcon(item.name)} ${item.name}: ${item.price}g\n`;
			noItems = false;
		}
	});

	if(noItems) message += "No available items for sale. Try `!build shop` to get started.";

	return message;
};

// Checks if the user can afford the item and then proceeds to buy it
const buyItem = async (user, item, amount) =>{
	const canBeBought = checkIfPossibleToBuy(user, item, amount);
	if(!canBeBought.response) return canBeBought.message;

	user.buyItem(item, amount);

	await user.save();

	return `You bought ${amount}x ${item.name}`;
};

const checkIfPossibleToBuy = (user, item, amount) => {
	if(!item) return { response: false, message: "The consumable does not exists" };
	const { requirement, name, price } = item;
	const { building, level } = requirement;
	const { resources, empire } = user;

	// User has sufficient gold?
	if(resources.gold < price * amount) {
		return {
			response: false,
			message: `Can not afford: ${amount}x ${name} costs ${price * amount} gold and you only have ${resources.gold} gold`,
		};
	}

	// User has high enough shop level?
	if(!empire.find(b => b.name === building && b.level >= level)) {
		return { response: false, message: `You need shop level ${level} to buy ${name}` };
	}

	return { response: true };
};

module.exports = { displayShop, handleBuyCommand };
