const Discord = require("discord.js");
const Canvas = require("canvas");
const fs = require("fs");

const createGridCanvas = async (user) => {
	// Set a new canvas to the dimensions of 700x250 pixels
	const canvas = Canvas.createCanvas(700, 700);
	// ctx (context) will be used to modify a lot of the canvas
	const ctx = canvas.getContext("2d");

	// Since the image takes time to load, you should await it
	const background = await Canvas.loadImage("./assets/building-images/grid-4x4.jpg");
	// This uses the canvas dimensions to stretch the image onto the entire canvas
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	const buildingImages = user.empire.map(building => {
		return new Promise((resolve, reject) => {
			// Add reject error handling pl0x
			// Wait for Canvas to load the image
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

	// Draw a shape onto the main canvas
	for(let i = 0; i < images.length; i++) {
		ctx.drawImage(images[i], (10 + ((canvas.width / 4) * user.empire[i].position[0])),
			(10 + ((canvas.width / 4) * user.empire[i].position[1])), (canvas.width / 4) - 20,
			(canvas.height / 4) - 20);
	}

	// Use helpful Attachment class structure to process the file for you
	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "welcome-image.png");

	return attachment;
};

module.exports = createGridCanvas;