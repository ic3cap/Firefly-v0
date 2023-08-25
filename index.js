const { Client, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const fs = require('node:fs');
const config = require('./config.json');
const cmdFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const cmds = []
const defaults = config.default;
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

for (file in cmdFiles) {
    file = cmdFiles[file];
    const cmd = require(`./commands/${file}`);
    let aliases = cmd.hasOwnProperty('aliases') && cmd['aliases'];
    if (aliases) {
        for (alias in aliases) {
            cmds[aliases[alias]] = cmd;
        };
    };
    cmds[cmd.name] = cmd;
}

bot.once(Events.ClientReady, () => {
    bot.user.setPresence({ status: 'idle', activities: [{ name: 'Catching fireflies', type: ActivityType.Custom }], status: 'idle' });
    console.log(`Up and running as ${bot.user.tag}.`);
});

bot.on(Events.MessageCreate, async msg => {
    if (!msg.content.startsWith(defaults.prefix) && !msg.content.startsWith(bot.user.tag)) {
        console.log('poof');
        return;
    };
    let content = msg.content;
    const args = content.slice(defaults.prefix.length).split(/ +/);
    let cmd = args.shift().toLowerCase();
    console.log('args ' + args);
    console.log('cmd ' + cmd);
    if (cmds.hasOwnProperty(cmd)) {
        cmd = cmds[cmd];
        cmd.execute({ author: msg.author, channel: msg.channel, args: args });
    }
});

bot.login(config.token);