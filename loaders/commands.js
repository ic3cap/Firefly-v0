const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '../commands');

module.exports = bot => {
    fs.readdirSync(dir).forEach(category => {
        fs.readdirSync(`${dir}/${category}`).forEach(file => {
            const cmdData = require(`${dir}/${category}/${file}`);
            if (cmdData.aliases) {
                cmdData.aliases.forEach(alias => bot.aliases.set(alias, cmdData.name));
            }
            bot.commands.set(cmdData.name, cmdData);
        });
    });
};