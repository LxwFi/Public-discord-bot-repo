const { MessageEmbed } = require("discord.js");

module.exports = {

    category: 'Response',
    description: 'Responds with the authors or @`s avatar',

    slash: false,
    testOnly: false,

    callback:  ({message}) => {
        const target = message.mentions.users.first() || message.author;


        const embed = new MessageEmbed()
        .setColor("0x800080")
        .setImage(target.displayAvatarURL({dynamic:true}))
        message.channel.send({embeds: [embed]});

    },
}