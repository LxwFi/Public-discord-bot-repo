const { MessageEmbed } = require("discord.js")
const TeemoJS = require('teemojs');
let api = TeemoJS(process.env.riot_api)

// gets a users riotid
module.exports = {

    category: 'Riot',
    description: 'Gets the "RiotID" of a user via their name',

    slash: false,
    testOnly: false,

    maxArgs: 1,
    expectedArgs: '[string]',

    callback: async ({ message, args }) => {
        const username = args.shift();
        message.delete().catch(O_O => { });

        let id = message.author.id;
        api.get('euw1', 'summoner.getBySummonerName', `${username}`)
            .then(data => message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("#8B0000")
                    .setTitle(`${data.name}'s RiotID`)
                    .setDescription(`${data.accountId}`)
                ]
            }))
            .catch(O_O => { message.channel.send(`<@${id}> enter a valid username`); });
    },
}