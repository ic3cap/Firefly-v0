const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '../');

// TODO: if you pass in a category, return cmds of that category
const getCmdArgs = cmdData => {
    let argFieldValue = '';
    for (const arg in cmdData.args) {
        let argData = cmdData.args[arg]
        let value = `**Name**: ${arg}\n**Desc**: ${argData.Desc}\n**Optional**: ${argData.Optional}\n`;
        argFieldValue = argFieldValue.concat('\n', value);
    }
    return argFieldValue;
}

module.exports = {
    name: 'help',
    desc: 'Displays a help message to the user. Provide a command as an argument to receive more information about that command. Ex: !help help',
    aliases: ['halp', 'h'],
    args: {
        CommandName: {
            Optional: true,
            Desc: 'Provides help on a specific command.'
        }
    },
    category: 'Misc',
    async execute(data) {
        if (data.args.length > 0) {
            let cmd = data.args[0];
            let cmdData = data.bot.commands.get(cmd);
            if (cmdData) {
                let helpEmbed = new EmbedBuilder()
                    .setTitle(`Command: ${cmd}`)
                    .setColor([255, 150, 0])
                    .addFields({ name: 'Category', value: `${cmdData.category}` }, { name: 'Aliases', value: `${cmdData.aliases.join(', ')}` }, {
                        name: 'Arguments',
                        value: `${getCmdArgs(cmdData) === '' ? 'No arguments found!' : getCmdArgs(cmdData)}`
                    })
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