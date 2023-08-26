const Discord = require('discord.js');
const { config } = require('dotenv');
const fs = require('fs');

const folders = {
    commands: fs.readdirSync('./commands'),
    events: fs.readdirSync('./events'),
    handlers: fs.readdirSync('./handlers')
}

const bot = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMembers
    ],
});

for (ev in folders.events) {
    ev = folders.events[ev]
    let evName = ev.slice(0, ev.indexOf('.'));
    let evData = require(`./events/${ev}`);
    if (evData.type === 'once') {
        bot.once(Discord.Events[evName], args => evData.triggered(bot, args));
    } else {
        bot.on(Discord.Events[evName], args => evData.triggered(bot, args));
    };
};

config();
bot.login(process.env.TOKEN);