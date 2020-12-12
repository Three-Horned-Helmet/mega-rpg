// used for cyberhackerwarfare4k
const qs = require("qs");
const axios = require("axios");

module.exports = {
	hidden:true,
	name: "hack",
	description: "Perform some hacking",
	async execute(message, args) {
		const code = args.join("").toLowerCase();
		if (!code)return;
		const result = await redeemCode(code);
		if (result) {
			return message.channel.send("`01101000 01100011 01101011 01110010`");
		}
	},
};


const redeemCode = async (code = "")=>{
	const data = qs.stringify({
		"code": code,
		"secret": process.env.cyberhackerSecret
	});
	const config = {
		method: "post",
		url: process.env.cyberhackerEnergyUrl,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		data:data
	};

	let response;
	try {
		response = await axios(config);
	}
	catch(err) {
		// fail silently
		return false;
	}
	return response.data;
};