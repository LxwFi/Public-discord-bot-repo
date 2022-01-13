module.exports = {

    category: 'Response',
    description: 'Gets the bot to repeat whatever the user typed',

    slash: false,
    testOnly: false,

    callback: ({ message, args }) => {
        const sayMessage = args.shift();
        message.delete().catch(O_O => { });
        message.channel.send(sayMessage);
    },

}