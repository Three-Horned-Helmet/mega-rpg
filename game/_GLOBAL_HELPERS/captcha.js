const Discord = require("discord.js");
const Canvas = require("canvas");
const { msToHumanTime } = require("./");

const handleCaptcha = async (message, user, tries, now)=> {
	const captcha = createCaptcha();

	const filter = msg =>{
		return msg.author.id === user.account.userId;
	};
	await message.channel.send(`<@${message.author.id}>  --- please type in ** captcha ** \n **${tries} ${tries > 1 ? "tries" : "try"}** remaining`, captcha.attachment);
	const collector = message.channel.createMessageCollector(filter, { time: 15000 });

	let userAnswer = "";

	collector.on("collect", m => {
		userAnswer = m.content;
		collector.stop();
	});

	collector.on("end", async () => {

		if(tries <= 1) {
			const currentBans = parseInt(user.account.bans, 10) || 1;
			const banTime = now + parseInt(Math.pow(50, currentBans), 10);
			user.account.bans += 1;
			user.account.banTime = banTime;

			await user.save();
			return message.channel.send(`<@${message.author.id}>  is banned for not typing in the captcha. You can plead for an unban at our support server -  or wait:\n **${msToHumanTime(banTime - now)}**`);
		}

		if (captcha.captchaNumbers.join("") === userAnswer) {
			return message.channel.send(`<@${message.author.id}>  passed the captcha - you can now continue the game!`);
		}

		return await handleCaptcha(message, user, tries - 1, now);
	});
};
const createCaptcha = ()=>{

	const canvas = Canvas.createCanvas(500, 150);
	const ctx = canvas.getContext("2d");

	ctx.font = "italic 40px Arial";
	ctx.fillStyle = "#7491A8";

	const captchaNumbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
	const spaceBetween = [0, 0, 0, 0].map((n, i)=> 80 + (i * 100));
	const verticalAxis = Array.from({ length: 4 }, () => Math.floor(Math.random() * (150 - 30) + 30));


	captchaNumbers.forEach((n, i)=>{
		ctx.fillText(captchaNumbers[i], spaceBetween[i], verticalAxis[i]);
	});

	const attachment = new Discord.MessageAttachment(canvas.toBuffer());
	const captcha = {
		attachment,
		captchaNumbers
	};
	return captcha;
};

module.exports = { handleCaptcha };

