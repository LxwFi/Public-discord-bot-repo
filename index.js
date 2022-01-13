const { Client, Intents, MessageEmbed } = require('discord.js');
const bot = new Client({
    intents:
        [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGE_TYPING,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_BANS,
            Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
            Intents.FLAGS.GUILD_INTEGRATIONS,
            Intents.FLAGS.GUILD_WEBHOOKS,
            Intents.FLAGS.GUILD_INVITES,
            Intents.FLAGS.GUILD_VOICE_STATES,
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGE_REACTIONS
        ]
});

const http = require("http");
//this pings the host my bot is on, to make sure it doesnt auto shut down
http.createServer((req, res) => {
    res.end();
}).listen(process.env.PORT || 3000);
setInterval(() => {
    http.get(process.env.link)
}, 300000);


const WOKCommands = require('wokcommands')
const path = require('path')

const osu = require('node-osu');
const Twit = require("twit");

// twitter feed

const twitterConfig = {
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token: process.env.access_token,
    access_token_secret: process.env.access_token_secret,
};

const twitterClient = new Twit(twitterConfig)
const stream = twitterClient.stream('statuses/filter', {
    follow: ['1011185550676709377', '989901172843655168', '1007103242356969472', '4923993500', '3238641808',]
});

const twitterChannel = '677676526778712076';

function isReply(tweet) {
    if (tweet.retweeted_status
        || tweet.in_reply_to_status_id
        || tweet.in_reply_to_status_id_str
        || tweet.in_reply_to_user_id
        || tweet.in_reply_to_user_id_str
        || tweet.in_reply_to_screen_name) {
        return false;
    } else {
        return true;
    }
}
stream.on('tweet', tweet => {
    if (isReply(tweet)) {
        const twitterMessage = `__**${tweet.user.name} (@${tweet.user.screen_name})    tweeted**__    https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
        bot.channels.cache.get(twitterChannel).send(twitterMessage);
    } else {
        return;
    }
});



// osu! feed

const osuApi = new osu.Api(process.env.otoken, {
    // baseUrl: sets the base api url (default: https://osu.ppy.sh/api)
    notFoundAsError: true,
    completeScores: true,
    parseNumeric: false
});

const osuChannel = '744397634445246482';

osuApi.getUser({ u: `LxwFi` }).then(user => {
    function round2(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }
    var currentPP = (user.pp.raw);
    var currentRank = (user.pp.rank);
    setInterval(() => {
        osuApi.getUser({ u: `LxwFi` }).then(user => {
            var OldPP = (user.pp.raw);
            var OldRank = (user.pp.rank);
            if (currentPP == OldPP) {
                return;
            }
            if (currentPP !== OldPP) {
                const UpdatedPP = (OldPP - currentPP);
                const Change = round2(UpdatedPP);

                const UpdatedRank = (currentRank - OldRank);
                if (UpdatedRank > 0) {
                    UpdatedRank = "+" + `${UpdatedRank}`;
                }

                const embed = new MessageEmbed()
                    .setColor("#FFB6C1")
                    .setTitle(`LxwFi Just Finished a map!`)
                    .addField(`Old PP`, `${currentPP.toString()}`, true)
                    .addField(`Change`, `${Change.toString()}`, true)
                    .addField(`New PP`, `${OldPP.toString()}`, true)
                    .addField(`Old Rank`, `#${currentRank.toString()}`, false)
                    .addField(`New Rank`, `#${OldRank.toString()}   //  (${UpdatedRank.toString()})`, true)
                    .setTimestamp()
                bot.channels.cache.get(osuChannel).send({ embeds: [embed] });
                currentPP = OldPP;
                currentRank = OldRank;
                return;
            }
        });
        return;
    }, 3000);
});


// template for commands

bot.on("messageCreate", async msg => {
    if (!msg.author.bot) {
        //do stuff
    }
});


// This is just so i can run a seperate bot on my local machine to test code, you wouldn't need this unless you are uploading your stuff to github
// this just basically means if its not in production, itll use the dev token (which is a testing bot on my local machine)
if (process.env.NODE_ENV !== 'production') {
    process.env.token = process.env.DevToken;
}

bot.on('error', (error) => { console.log(error) });
bot.on("ready", () => {
    new WOKCommands(bot, {
        // The name of the local folder for your command files
        commandsDir: path.join(__dirname, 'commands'), // update to your own command folder name, points to "commands" by default
        testServers: ['650058489401442326'], // change this to personal server(s)
        showWarns: true, // personal preference, adjust to your own liking
        botOwners: `${process.env.botOwner}`, // change this to your own ID (+ friends)
    })
        .setDefaultPrefix('.') // change to whatever prefix you would like
        .setColor(0x52307c)
    bot.user.setActivity('".whoami"');
    //  bot.user.setUsername("Dev")
    //   const image = '(insert link)'
    //   bot.user.setAvatar(/*image*/)
})
bot.once("reconnecting", () => {
    console.log("Reconnecting!");
})
bot.once("disconnect", () => {
    console.log("Disconnected!");
})
bot.login(process.env.token);

module.exports = { osuApi, twitterConfig };