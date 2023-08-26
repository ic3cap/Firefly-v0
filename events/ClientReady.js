module.exports = {
    type: 'once',
    triggered(bot, args) {
        console.log(`Logged in as: ${bot.user.tag}.`);
    }
}