const consumeObj = require("../use/consumables-object");

// Runs functions depending on the given args
const handleBuyCommand = async (args, user) =>{
	if(args.length === 0) {
		const message = displayShop(user);
		return message;
	}

	const joinedArg = args.map(a => a.charAt(0).toUpperCase() + a.slice(1).toLowerCase()).join(" ");
	const item = consumeObj[joinedArg];

	const message = await buyItem(user, item);

	return message;
};

// Show all items in the shop and their price
const displayShop = (user) =>{
	let message = "";

	Object.values(consumeObj).forEach(item =>{
		console.log(item);
		message += `${item.name}: ${item.price}g\n`;
	});

	return message;
};

// Checks if the user can afford the item and then proceeds to buy it
const buyItem = async (user, item) =>{
	if(!item) return "The consumable does not exists";

	// User has sufficient gold?
	if(user.resources.gold < item.cost) {
		return `Can not afford: ${item.name} costs ${item.price} gold and you only have ${user.resources.gold} gold`;
	}

	await user.buyItem(item);

	return `You bought a ${item.name}`;
};


module.exports = { displayShop, handleBuyCommand };