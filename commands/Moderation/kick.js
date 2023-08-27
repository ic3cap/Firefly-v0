const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'kick',
    desc: 'Kicks a guild member.',
    aliases: ['k', 'kik'],
    args: {
        User: {
            Optional: false,
            Desc: 'The ID or tag of the user you want to kick.'
        },
        Reason: {
            Optional: true,
            Desc: 'The reason why you want to kick the user.'
        }
    },
    category: 'Moderation',
    async execute({ args, author, msg }) {
        let victim = args[0];
        victim = victim.replace('<@', '').replace('>', '');

        if (!victim || msg.mentions.everyone || msg.mentions.users.size !== 1 || author.bot || victim === author || !msg.guild.available) {
            return;
        };

        victim = await msg.guild.members.fetch(victim);

        if (!msg.member.permissions.has(PermissionsBitField.Flags.KickMembers, true) || victim.permissions.has(PermissionsBitField.Flags.KickMembers, true)) {
            return;
        };

        let reason = 'No reason provided.'
        if (args[1] && !args[2]) {
            reason = args[1];
        } else if (args[1] && args[2]) {
            args.shift();
            reason = args.join(' ');
        }

        victim.kick(reason);
    }
}