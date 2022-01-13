const { MessageAttachment} = require("discord.js");

module.exports = {

    category: 'Currency',
    description: 'Sends a link to a list of currency codes',

    slash: 'both',
    testOnly: false,

    callback: ({ message, interaction }) => {
        if (message) {
            message.reply('https://pastebin.com/29nTNYpH')
        }
        if (interaction){
            interaction.reply('https://pastebin.com/29nTNYpH')
        }
    },
}