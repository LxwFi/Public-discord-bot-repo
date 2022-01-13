const { MessageEmbed, DiscordJS } = require("discord.js")
const CCClient = require('currency-converter-lt')
let CC = new CCClient()
var CFormat = require('currency-formatter');

module.exports = {

  category: 'Currency',
  description: 'Currency exchange command',

  slash: 'both',
  testOnly: false,

  callback: ({ message, channel, interaction }) => {
    if (interaction) {
      const embed = new MessageEmbed()
        .setTitle("Wrong usage")
        .setDescription("Please use '.exchange' instead")
        .setColor(0xFF0000)
        .setTimestamp()
      interaction.reply({ embeds: [embed] });
      return;
    }

    const questions = [
      'Type a currency to exchange **from**',
      'Type a currency to exchange **into**',
      'Type the amount you are exchanging',
    ]
    let counter = 0;

    const filter = (m) => {
      return m.author.id === message.author.id
    }

    const collector = channel.createMessageCollector({
      filter,
      max: questions.length,
      time: 1000 * 20 // set this to however long you want timout to be
    })

    message.channel.send(questions[counter++])
    collector.on('collect', message => {
      if (counter < questions.length) {
        message.channel.send(questions[counter++])
      }
    })

    collector.on('end', async collected => {
      if (collected.size < questions.length) {

        const embed = new MessageEmbed()
          .setTitle("Timed out")
          .setDescription(`Took longer than 20 seconds to answer`)
          .setColor(0xFF0000)
        message.reply({ embeds: [embed] });
        return;
      }

      let amount = collected.entries(message);

      let from = amount.next().value[1].content;
      let into = amount.next().value[1].content;
      let sum = amount.next().value[1].content;
      // this just gets the values of each answer inputted into seperate variables

      try {
        await CC.from(from).to(into).amount(parseFloat(sum)).rates();
        await CC.from(from).to(into).amount(parseFloat(sum)).convert();
      } catch (err) {
        const embed = new MessageEmbed()
          .setTitle("Wrong currency code and/or amount")
          .setDescription("Please check you entered a valid currency code and/or amount \n for a full list type `.codes`")
          .setColor(0xFF0000)
        await message.reply({ embeds: [embed] });
        return;
      } // checks if correct things have been entered and throws err otherwise

      let rates = await CC.from(from).to(into).amount(parseFloat(sum)).rates();
      let converted = await CC.from(from).to(into).amount(parseFloat(sum)).convert();

      let fromU = from.toUpperCase();
      let intoU = into.toUpperCase();
      // Converts the codes into upper case for the currency library

      if (isNaN(converted)) {
        const embed = new MessageEmbed()
          .setTitle("Exchange error")
          .setDescription(`Could not get exchange rate for **${fromU}** to **${intoU}**`)
          .setColor(0xFF0000)
        message.reply({ embeds: [embed] });
        return;
      }

      let final = CFormat.format(converted, { decimal: '.', thousand: ',', code: intoU });
      let beforeExchange = CFormat.format(sum, { decimal: '.', thousand: ',', code: fromU });

      const embed = new MessageEmbed()
        .setTitle("Currency Converter")
        .setDescription(`You have exchanged **${fromU}** into **${intoU}** at a rate of **${rates}**`)
        .setColor(0x00FF00)
        //52307c
        .setTimestamp()
        .addFields([{
          name: 'Final amount',
          value: final,
        },
        {
          name: '(Converted from)',
          value: beforeExchange,
        }
        ])
      message.reply({ embeds: [embed] });
    })
  },
}