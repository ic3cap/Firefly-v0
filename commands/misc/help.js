module.exports = {
    name: 'help',
    desc: 'Displays a help message to the user.',
    aliases: ['halp', 'h'],
    execute(data) {
        data.channel.send(`What do you need help with, ${data.author}?`);
    }
}