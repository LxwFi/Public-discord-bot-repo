const { MessageEmbed } = require("discord.js")
const { osuApi } = require("../index.js")

//"userbest" just shows the best beatmap of the user, itll send various information of the play for the player
module.exports = {

    category: 'osu!',
    description: 'Returns a user`s best map along with some info about the play',

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

        osuApi.getUserBest({ u: `${username}` }).then(scores => {
            function round2(num) {
                return +(Math.round(num + "e+2") + "e-2");
            }

            const RawAcc = (scores[0].accuracy * 100);
            const Accuracy = round2(RawAcc);

            const embed = new MessageEmbed()
                .setColor("#FFB6C1")
                .setTitle(`Best Score Results for : ${username}`)
                .addField("Beatmap", `${scores[0].beatmap.title} - ${scores[0].beatmap.artist}`, false)
                .addField("Max combo", `${scores[0].maxCombo}`, true)
                .addField("Rank", `${scores[0].rank}`, true)
                .addField("PP", `${scores[0].pp}`, true)
                .addField("Accuracy", `${Accuracy}%`, true)
                .addField("Date Played", `${scores[0].raw_date}`, true)
            message.channel.send({ embeds: [embed] });

        }).catch(O_O => { message.channel.send(`<@${mId}> enter a valid username`); });
    },
}