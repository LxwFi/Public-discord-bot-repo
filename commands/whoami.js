const { MessageEmbed } = require("discord.js");

module.exports = {

    category: 'Response',
    description: 'Responds in the users DM`s with information about the bot',

    slash: false,
    testOnly: false,

    callback: ({ message, args }) => {
        const Embed = new MessageEmbed()
        .setColor("0x800080")
        .setTitle("FidelityBot info")
        .setAuthor('Info!', 'https://i.kym-cdn.com/photos/images/newsfeed/002/205/323/176.jpg')
        .setDescription('Hey! I am a bot coded by LxwFi!')
        .setThumbnail('https://data.whicdn.com/images/322396759/large.jpg')
        .addField('What do i do?', 'Currently being used for twitter, osu! and currency exchange')
        .addField('What is my prefix?', 'My prefix is "."', true)
        .addField('How to make me say stuff?', '.say followed by your message', true)
        .addField('How do i get my avatar?', '.avatar @mention(optional)', true)
        .addField('What other commands do i have?', 'do .commands to see all of my commands', true)
        .addField('What is being worked on?', 'something', true)
        .setTimestamp()
        .setFooter('Designed with love');
        message.author.send({embeds: [Embed]})
        message.channel.send("I have DM'ed you the message! Make sure you have DM's enabled!")
    },
}