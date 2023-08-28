const Discord = require('discord.js');
const { config } = require('dotenv');
const fs = require('fs');

const bot = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMembers
    ],
});

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

fs.readdirSync('./loaders').forEach(loader => require(`./loaders/${loader}`)(bot));

config();
bot.login(process.env.TOKEN);