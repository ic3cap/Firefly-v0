const config = require('../config.json');
module.exports = {
    type: 'on',
    triggered(bot, msg) {
        if (msg.author.bot || (!msg.content.startsWith(config.default.prefix)) ) {
            return;
        };

        let content = msg.content;
        let args = content.slice(config.default.prefix.length).trimStart().split(/ +/);
        let cmd = args.shift().toLowerCase();

        const cmdData = bot.commands.get(cmd) || (bot.aliases.get(cmd) && bot.commands.get(bot.aliases.get(cmd)));

        if (!cmdData) {
            return;
        }

        cmdData.execute({ args: args, author: msg.author, bot: bot, channel: msg.channel, msg: msg });
    }
}