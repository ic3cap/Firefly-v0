const config = require('../config.json');
module.exports = {
    type: 'on',
    triggered(bot, msg) {
        if (msg.author.bot || !msg.content.startsWith(config.default.prefix)) {
            return;
        };

        let content = msg.content;
        const args = content.slice(config.default.prefix.length).split(/ +/);
        let cmd = args.shift().toLowerCase();

        cmd = bot.commands.get(cmd) || (bot.aliases.get(cmd) && bot.commands.get(bot.aliases.get(cmd)));

        if (!cmd) {
            return;
        }
        //console.log(msg.guild);
        cmd.execute({ args: args, author: msg.author, bot: bot, channel: msg.channel, msg: msg });
    }
}