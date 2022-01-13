module.exports = {

    category: 'Check',
    description: 'Command to see if the bot is responsive',

    slash: false,
    testOnly: false,

    callback:  ({ message }) => {
        message.channel.send("I am working!");
    },
}