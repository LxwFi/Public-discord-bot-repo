module.exports = {

    category: 'Response',
    description: 'Responds with funny picture',

    slash: false,
    testOnly: false,

    callback:  ({ message }) => {
        message.delete()
        message.channel.send({ files: ['https://cdn.discordapp.com/attachments/677676526778712076/877332149261439026/anomaly.png'] });
      
    },
}