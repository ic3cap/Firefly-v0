const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const fruits = {
    'Yami Yami no Mi': {
        image: 'https://i.imgur.com/vZrTdl0.png'
    },
    default: {
        image: ''
    }
}

const getFruitImage = fruit => {
    return fruits.hasOwnProperty(fruit) ? fruits[fruit].image : fruits.default.image;
}

const formatText = (text, charCap) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    const pages = [];
    let currentPage = "";

    for (const sentence of sentences) {
        if (currentPage.length + sentence.length <= charCap) {
            currentPage += sentence;
        } else {
            pages.push(currentPage.trim());
            currentPage = sentence.trim();
        }
    }

    if (currentPage.length > 0) {
        pages.push(currentPage.trim());
    }

    for (let i = 1; i < pages.length; i++) {
        const lastSentence = pages[i - 1].match(/[^.!?]+[.!?]+$/);
        if (lastSentence) {
            pages[i] = lastSentence[0] + " " + pages[i];
            pages[i - 1] = pages[i - 1].replace(lastSentence[0], "").trim();
        }
    }

    return pages;
}

const createFruitEmbed = async (link, fruit, msg, data) => {
    try {
        const response = await axios.get(link);
        const $ = cheerio.load(response.data);
        const paragraphs = [];

        $('p').each((_, element) => {
            const paragraphText = $(element).text();
            paragraphs.push(paragraphText);
        });

        const cap = 1000; // 4096
        const fruitImage = getFruitImage(fruit);
        // regex to get rid of wiki reference tags, so like TextGoesHere [1], TextGoesHere [2]
        let fullText = paragraphs.join('\n').replaceAll(/\[\d+\]/g, '');
        let currentPage = 0;
        let numPages = Math.round(fullText.length / cap);
        let pageDescs = formatText(fullText, cap);
        let pages = [];
        let pos = 0;

        for (let i = 0; i < numPages; i++) {
            let embed = new EmbedBuilder()
                .setColor(255, 255, 255)
                .setTitle(`Devil Fruit Encyclopedia: ${fruit}`)
                //.setDescription(fullText.slice(pos, pos + cap).trimEnd())
                .setDescription(pageDescs[i])
                .setThumbnail(fruitImage)
                .setFooter({ text: `Page: ${i + 1} / ${numPages}` });
            pages.push(embed);
            pos += cap;
        }

        const flipBack = new ButtonBuilder()
            .setLabel('<')
            .setStyle(ButtonStyle.Success)
            .setCustomId('flipBack');

        const flipFront = new ButtonBuilder()
            .setLabel('>')
            .setStyle(ButtonStyle.Success)
            .setCustomId('flipFront');

        const buttonRow = new ActionRowBuilder().addComponents(flipBack, flipFront);
        const edit = await msg.edit({ content: 'Here you go!', embeds: [pages[0]], components: [buttonRow] });
        const filter = interaction => interaction.user.id === data.author.id;
        const collector = edit.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter,
            time: 300000
        });

        collector.on('collect', async interaction => {
            if (interaction.customId === 'flipFront' && currentPage < numPages) {
                currentPage++;
                await msg.edit({ content: 'Here you go!', embeds: [pages[currentPage]], components: [buttonRow] });
            } else if (interaction.customId === 'flipBack' && currentPage > 0) {
                currentPage--;
                await msg.edit({ content: 'Here you go!', embeds: [pages[currentPage]], components: [buttonRow] });
            }
        })

        return pages;
    } catch (error) {
        console.error('Error fetching or extracting:', error);
    }
}

module.exports = {
    name: 'dflookup',
    desc: 'Looks up a devil fruit on the One Piece wiki.',
    aliases: ['df'],
    category: 'One Piece',
    async execute(data) {
        const fruit = data.args[0];

        if (fruit) {
            const apiUrl = `https://onepiece.fandom.com/api.php?action=query&format=json&list=search&srsearch=${fruit}`;

            try {
                const response = await axios.get(apiUrl);
                const searchResults = response.data.query.search;

                if (searchResults.length === 0 || !fruits.hasOwnProperty(searchResults[0].title)) {
                    data.channel.send('Oops, I got no results. :(');
                    return;
                }

                const topResult = searchResults[0];
                const link = `https://onepiece.fandom.com/wiki/${encodeURIComponent(topResult.title)}`;

                await data.channel.send('Give me a second..')
                    .then(msg => createFruitEmbed(link, topResult.title, msg, data))
                    .catch(error => console.log(error));
            } catch (error) {
                console.log(error);
                data.channel.send('Oops, I encountered an error while trying to look this fruit up. Try again!');
            }
        } else {
            data.channel.send('You gotta provide a fruit.');
        };
    }
}