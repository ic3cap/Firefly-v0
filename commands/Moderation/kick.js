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
    execute(data) {

    }
}