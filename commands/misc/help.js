const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '../');

module.exports = {
    name: 'help',
    desc: 'Displays a help message to the user. Provide a command to receive information about that command.',
    aliases: ['halp', 'h'],
    category: 'Misc',
    execute(data) {
        if (data.args.length > 0) {
            let cmd = data.args[0];
            let cmdData = data.bot.commands.get(cmd);
            if (cmdData) {
                let helpEmbed = new EmbedBuilder()
                    .setTitle(`Command: ${cmd}`)
                    .setColor([255, 150, 0])
                    .addFields({ name: 'Category', value: `${cmdData.category}` }, { name: 'Aliases', value: `${cmdData.aliases.join(', ')}` })
                    .setDescription(this.desc);
                data.channel.send({ embeds: [helpEmbed] });
                return;
            } else {
                return;
            }
        }

        let helpEmbed = new EmbedBuilder()
            .setTitle('List of Commands')
            .setColor([255, 150, 0]);

        let desc = '';
        fs.readdirSync(dir).forEach(category => {
            let categoryCmds = fs.readdirSync(`${dir}/${category}`).filter(file => file.endsWith('.js'));
            if (categoryCmds.length > 0) {
                desc = desc.concat('\n\n', `**${category}**`);
                categoryCmds.forEach(cmd => {
                    cmd = cmd.slice(0, cmd.indexOf('.'));
                    desc = desc.concat('\n', `${cmd}: ${data.bot.commands.get(cmd).desc}`);
                })
            }
        });

        helpEmbed.setDescription(desc);

        data.channel.send(`What do you need help with, ${data.author}?`);
        data.channel.send({ embeds: [helpEmbed] });
    }
}