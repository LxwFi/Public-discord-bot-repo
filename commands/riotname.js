const { MessageEmbed } = require("discord.js")
const TeemoJS = require('teemojs');
let api = TeemoJS(process.env.riot_api)

// gets a users riotid
module.exports = {

    category: 'Riot',
    description: 'Gets the riot name of a user via their "RiotID"',

    slash: false,
    testOnly: false,

    maxArgs: 1,
    expectedArgs: '[string]',

    callback: async ({ message, args }) => {
        const ID = args.shift();
        message.delete().catch(O_O => { });

        let mId = message.author.id;
        api.get('euw1', 'summoner.getByAccountId', `${ID}`)
            .then(data => message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("#8B0000")
                    .setTitle(`That ID belongs to: ${data.name}`)
                ]
            }))
            .catch(O_O => { message.channel.send(`<@${mId}> enter a valid ID`); });
    },
}