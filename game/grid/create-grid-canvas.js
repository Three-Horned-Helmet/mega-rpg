const Discord = require("discord.js");
const Canvas = require("canvas");
const fs = require("fs");

const createGridCanvas = async (user) => {
	const canvas = Canvas.createCanvas(700, 700);
	const ctx = canvas.getContext("2d");

	const background = await Canvas.loadImage("./assets/building-images/grid-4x4.jpg");
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	// Wait for Canvas to load the image
	const buildingImages = user.empire.map(building => {
		return new Promise((resolve, reject) => {
			// Add reject error handling pl0x
			try{
				// check if file exists
				const imgUrl = `./assets/building-images/${building.name.replace(" ", "-")}-level-${building.level}.png`;
				if (fs.existsSync(imgUrl)) {
					return resolve(
						Canvas.loadImage(imgUrl),
					);
				}
				else {
					return resolve(
						Canvas.loadImage("./assets/no-image.png"),
					);
				}
			}
			catch {
				console.log(`Image does not exist, ${building}`);
			}
		});
	});

	const images = await Promise.all(buildingImages);

	// Draw images onto the main canvas
	for(let i = 0; i < images.length; i++) {
		ctx.drawImage(images[i], (canvas.width * 0.02 + ((canvas.width / 4) * user.empire[i].position[0])),
			(canvas.width * 0.05 + ((canvas.width / 4) * user.empire[i].position[1])), (canvas.width / 4) - 20,
			(canvas.height / 4.5) - 20);

		// Add building name
		ctx.font = "24px sans-serif";
		ctx.fillStyle = "#000000";

		ctx.fillText(`${user.empire[i].name[0].toUpperCase() + user.empire[i].name.slice(1)}(${user.empire[i].level})`, (((canvas.width / 8) - (user.empire[i].name.length + 3) * 6.2) + ((canvas.width / 4) * user.empire[i].position[0])),
			(canvas.width * 0.04 + ((canvas.width / 4) * user.empire[i].position[1])));
	}

	// Use helpful Attachment class structure to process the file for you
	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "welcome-image.png");

	return attachment;
};

module.exports = createGridCanvas;