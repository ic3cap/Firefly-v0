const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '../events');

module.exports = bot => {
    fs.readdirSync(dir).forEach(file => {
        let evName = file.slice(0, file.indexOf('.'));
        let evData = require(`${dir}/${file}`);
        if (evData.type === 'once') {
            bot.once(Events[evName], args => evData.triggered(bot, args));
        } else {
            bot.on(Events[evName], args => evData.triggered(bot, args));
        };
    });
};