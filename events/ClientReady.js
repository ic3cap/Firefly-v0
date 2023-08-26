module.exports = {
    type: 'on',
    triggered(bot) {
        bot.user.setPresence({ status: 'idle', activities: [{ name: 'Catching fireflies', type: 4 }], status: 'idle' });
        console.log(`Logged in as: ${bot.user.tag}`);
    }
}