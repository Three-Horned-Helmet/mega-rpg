Come play with us for free at our [support server](https://discord.gg/BHrHQfs6Mm)

OR [invite](https://discordapp.com/oauth2/authorize?client_id=721024429345341560&scope=bot&permissions=1074121792) the bot to your own server!

# MEGA RPG

[![Discord Bots](https://top.gg/api/widget/status/721024429345341560.svg)](https://top.gg/bot/721024429345341560)

[![Build Status](https://travis-ci.org/Three-Horned-Helmet/mega-rpg.svg?branch=master)](https://travis-ci.org/Three-Horned-Helmet/mega-rpg)

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/4d263688effd49c2b04dae98b985e1db)](https://www.codacy.com/gh/Three-Horned-Helmet/mega-rpg?utm_source=github.com&utm_medium=referral&utm_content=Three-Horned-Helmet/mega-rpg&utm_campaign=Badge_Grade)

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

---

## Donations and Support

Support our bot on [Patreon](https://www.patreon.com/megarpg) and receive in-game benefits, 

or donate to our [PayPal](https://www.paypal.com/paypalme/megarpg) account and help us keeping the servers alive.

---

## Get started

1. [Join](https://discord.gg/BHrHQfs6Mm) a discord server that has the bot or [invite](https://discordapp.com/oauth2/authorize?client_id=721024429345341560&scope=bot&permissions=1074121792) the bot to your own server.
2. There's over 30 commands available, try typeing `!help` or `!quest` to get you started.
3. If you get stuck, you can always type `!info` to get a DM about the commands!


## Intro

In Mega-RPG you can build a city and explore the surroundings with your hero and army. You are able to do quests, kill minibosses and drop epic loot during your adventures! If you are brave enough you will also be able to raid dungeons, but be warned you may need the help from other adventurers to take it down!

The Game is set in a fantasy-medieval universe and the journey begins in a kingdom tyrannized by a Bandit King and his Impling helpers. The citizens of the kingdom has lost all hope, but some try their best to live their lives. You are a master of your own empire, but with an army and a hero you may be able to help the citizens and bring down the Bandit King!

The game is in an early development stage, but we are continuously expanding the game with more quests and features. If you see something you like (or dislike), please let us know by creating a post on our official Discord support server, or send us a message directly.
Any feedback or bug-reports are highly appreciated!

A big thanks to everyone that has helped us with the early testing!

## How to run Mega-RPG locally

1. Install [NodeJS](https://nodejs.org/en/download/).
2. Install [MongoDB Community](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials).
3. [Clone](https://github.com/Three-Horned-Helmet/mega-rpg.git) the project from github OR run: `$ git clone https://github.com/Three-Horned-Helmet/mega-rpg.git`
4. `$ cd mega-rpg`
5. `$ touch .env`
4. `$ npm install`
6. Modify the `.env` file according to your needs. This file should be held secret and not shared on Github or any other platform. A personal Discord Token can be obtained from [Discord Developer](https://discord.com/developers/applications). The `DISCORD_PREFIX` value represent what your bot should listen to. Eg `DISCORD_PREFIX=!` will listen to any commands that starts with `!` ==> `!profile` will return the profile of whoever wrote the command.
7. `$ mongod` run the mongodb deamon
8. `$ npm start` start the project. A 'Ready!' will be logged to the terminal upon success

---

## Run tests

1. Install the project by following the steps over
2. `$ npm test`

---
