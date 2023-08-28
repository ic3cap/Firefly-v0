const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'ban',
    desc: 'Bans a guild member.',
    aliases: ['b', 'bn'],
    args: {
        User: {
            Optional: false,
            Desc: 'The ID or tag of the user you want to ban.'
        },
        Reason: {
            Optional: true,
            Desc: 'The reason why you want to ban the user.'
        },
        DeleteMessages: {
            Optional: true,
            Desc: 'Number of seconds of messages to delete, must be between 0 and 604800 (7 days), inclusive.'
        }
    },
    category: 'Moderation',
    async execute({ args, author, msg, channel }) {
        let victim = args[0];
        victim = victim.replace('<@', '').replace('>', '');

        if (!victim || msg.mentions.everyone || msg.mentions.users.size !== 1 || author.bot || victim === author || !msg.guild.available) {
            console.log('l1');
            return;
        };

        victim = await msg.guild.members.fetch(victim);

        if (!msg.member.permissions.has(PermissionsBitField.Flags.BanMembers, true) || victim.permissions.has(PermissionsBitField.Flags.BanMembers, true)) {
            console.log('l2');
            return;
        };

        let time = typeof args[args.length - 1] === 'number' ? args[args.length - 1] : 0;
        let reason = 'No reason provided.'

        if (args[1] && !args[2]) {
            reason = args[1];
        } else if (args[1] && typeof args[2] !== 'number') {
            args.shift();
            reason = args.join(' ');
        }

        console.log(reason, time);
        victim.ban({ reason: reason, deleteMessageSeconds: time });
        channel.send(`Successfully banned user ${victim} with reason: ${reason} ${time > 0 ? `Deleted messages from: ${time} ago.` : 'Deleted zero messages.'}`);
    }
}
