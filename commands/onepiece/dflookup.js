const { EmbedBuilder } = require('discord.js');
const pagination = require('discord.js-pagination');
const axios = require('axios');
const cheerio = require('cheerio');

const fruitImages = {
    default: '',
    'Yami Yami no Mi': ''
}

const getFruitImage = fruit => {
    return fruitImages.hasOwnProperty(fruit) ? fruitImages[fruit] : fruitImages.default
}

const createFruitEmbed = async (link, fruit) => {
    try {
        const response = await axios.get(link);
        const $ = cheerio.load(response.data);
        const paragraphs = [];
        $('p').each((_, element) => {
            const paragraphText = $(element).text();
            paragraphs.push(paragraphText);
        });
        const fruitImage = getFruitImage(fruit);
        let text = paragraphs.join('\n');
        let numPages = Math.floor(text.length / 4096);
        let pages = [];
        for (let i = 0; i < numPages; i++) {
            let embed = new EmbedBuilder()
                .setTitle(`Devil Fruit Encyclopedia: ${fruit}`);
            pages.push(embed);
        }
        console.log(pages);
        return pages;
    } catch (error) {
        console.error('Error fetching or extracting:', error);
    }
}

module.exports = {
    name: 'dflookup',
    desc: 'Looks up information on a given devil fruit. Make sure to omit the "no mi" part.',
    aliases: ['df', 'lookupdf'],
    async execute(data) {
        const fruit = data.args[0];
        if (fruit) {
            const apiUrl = `https://onepiece.fandom.com/api.php?action=query&format=json&list=search&srsearch=${fruit}`;
            try {
                const response = await axios.get(apiUrl);
                const searchResults = response.data.query.search;
                if (searchResults.length === 0) {
                    data.channel.send('Oops, I got no results. :(');
                    return;
                }
                const topResult = searchResults[0];
                const link = `https://onepiece.fandom.com/wiki/${encodeURIComponent(topResult.title)}`;
                data.channel.send({ embeds: [...await createFruitEmbed(link, topResult.title)] });
            } catch (error) {
                console.log(error);
                data.channel.send('Oops, I encountered an error while trying to look this fruit up. Try again!');
            }
        } else {
            data.channel.send('You gotta provide a fruit.');
        };
    }
}