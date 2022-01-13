const { MessageEmbed } = require("discord.js")
const {osuApi} = require("../index.js")

//"user" sends information about the user, such as rank, points and country rank
module.exports = {
    
    category: 'osu!',
    description: 'Returns the user specified on osu! with various information',

    slash: false,
    testOnly: false,

    maxArgs: 1,
    expectedArgs: '[string]',

    callback: async ({ message, args, interaction }) => {
        if (interaction) {
            interaction.reply("Please use the non slash version of this command using `.`");
            return
        }

        const username = args.shift();
        message.delete().catch(O_O => { });
        let mId = message.author.id;
        
        function round2(num) {
            return +(Math.round(num + "e+2") + "e-2");
        }

        osuApi.getUser({ u: `${username}` }).then(user => {
            const embed = new MessageEmbed()
            .setColor("#FFB6C1")
            .setTitle(`PP Results for : ${username}`)
            .addField("Total PP", `${user.pp.raw}`, true)
            .addField("Rank", `#${user.pp.rank}`, true)
            .addField("Accuracy", `${round2(user.accuracy)}%`, true)
            .addField("Country", `${user.country}`, true)
            .addField("Country Rank",`#${user.pp.countryRank}`, true)
            .addField("Join Date", `${user.raw_joinDate}`, true)
            message.channel.send({ embeds: [embed] });
        }).catch(O_O => { message.channel.send(`<@${mId}> enter a valid username`); });
    },
}