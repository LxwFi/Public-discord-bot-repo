const Discord = require("discord.js");
const http = require("http");
//this pings the host my bot is on, to make sure it doesnt auto shut down
http.createServer((req, res) => {
    res.end();
}).listen(process.env.PORT || 3000);
setInterval(() => {
    http.get(process.env.link)
}, 300000);
const bot = new Discord.Client();
const osu = require('node-osu');
const Twit = require("twit");
const { User } = require("node-osu");
const { Beatmaps } = require("node-osu/lib/Constants");

function randomNumber() {
    let rndm = (Math.round)(Math.random() * 101)
    return (rndm);
}
//otoken reffers to my osu token which the bot has access to
const osuApi = new osu.Api(process.env.otoken, {
    // baseUrl: sets the base api url (default: https://osu.ppy.sh/api)
    notFoundAsError: true,
    completeScores: true,
    parseNumeric: false
});






// This is just so i can run a seperate bot on my local machine to test code, you wouldn't need this unless you are uploading your stuff to github
// this just basically means if its not in production, it'll use the dev token (which is a testing bot on my local machine)
if (process.env.NODE_ENV !== 'production') {
    process.env.token = process.env.DevToken;
}

//  Below you'd put your token in the brackets, but i have mine in an ENV file
bot.login(process.env.token);

bot.on('error', (error) => { console.log(error) });

// console logs
bot.on("ready", () => {
    console.log("Servers:");
    bot.guilds.forEach((guild) => {
        console.log("- " + guild.name);
    })
    console.log(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} servers.`);
    //                 \/ Change below to set bot activity         /\ and change above to display what you want to display in logs, even delete the line if you wish
    //                                                                I highly recommend leaving atleast "console.log("bot has started")" just so you have a visual indicator that the bot has started
    bot.user.setActivity('".whoami?"');
    //  bot.user.setUsername("Dev")
    //   const image = '(insert link)'
    //   bot.user.setAvatar(/*image*/)
})
bot.once("reconnecting", () => {
    console.log("Reconnecting!");
})
bot.once("disconnect", () => {
    console.log("Disconnect!");
})

//passing information so the bot can utilise the twit api
const twitterConf = {
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token: process.env.access_token,
    access_token_secret: process.env.access_token_secret,
}
const twitterClient = new Twit(twitterConf)
// this is for is for my own server
const d = '677676526778712076';
// use this for testing heroku bot
const d1 = '677676526778712076';
const spam = '678372210859311169';
//osu channel
const od = '744397634445246482';

// osu stuff  \/ \/

osuApi.getUser({ u: `LxwFi` }).then(user => {
    function round2(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }
    var currentPP = (user.pp.raw);
    var currentRank = (user.pp.rank);
    setInterval(() => {
        osuApi.getUser({ u: `LxwFi` }).then(user => {
            var check1 = (user.pp.raw);
            var check2 = (user.pp.rank);
            if (currentPP == check1) {
                return;
            }
            if (currentPP !== check1) {
                const PPcalc = (check1 - currentPP);
                const PPcalc2 = round2(PPcalc);

                const PPcalc3 = (currentRank - check2);

                const PPCalcMsg = new Discord.RichEmbed()
                    .setColor("#FFB6C1")
                    .setTitle(`LxwFi Just Finished a map!`)
                    .addBlankField()
                    .addField(`Old PP = ${currentPP}`, "‎", false)
                    .addField(`PP difference = ${PPcalc2}`, "‎", false)
                    .addField(`New PP Amount = ${check1}`, "‎", false)
                    .addField(`Old Rank = #${currentRank}`, "‎", false)
                    .addField(`New Rank = #${check2}    //   (#${PPcalc3})`, "‎", false)
                    .setTimestamp()
                    .setFooter('Designed with love', 'https://media.giphy.com/media/kbtysky2x8fZLW8osP/source.gif');
                bot.channels.get(od).send(PPCalcMsg);
                currentPP = check1;
                currentRank = check2;
                return;
            }
        });
        return;
    }, 3000);
});

// osu stuff pt2

bot.on("message", async msg => {
    if (!msg.author.bot) {

        const args = msg.content.slice(process.env.affix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if (command === "userbest") {
            const username = args.join(" ");
            msg.delete().catch(O_O => { });
            osuApi.getUserBest({ u: `${username}` }).then(scores => {


                function round2(num) {
                    return +(Math.round(num + "e+2") + "e-2");
                }

                const DPacc = (scores[0].accuracy * 100);
                const DPacc2 = round2(DPacc)

                const BestEmbed = new Discord.RichEmbed()
                    .setColor("#FFB6C1")
                    .setTitle(`Best Score Results for : ${username}`)
                    .addBlankField()
                    .addField("Beatmap Title = " + scores[0].beatmap.title + " - " + scores[0].beatmap.artist, "‎", false)
                    .addField("Max combo = " + scores[0].maxCombo, "‎", false)
                    .addField("Rank = " + scores[0].rank, "‎", false)
                    .addField("PP = " + scores[0].pp, "‎", false)
                    .addField("Accuracy = " + DPacc2 + "%", "‎", false)
                    .setTimestamp()
                    .setFooter('Designed with love', 'https://media.giphy.com/media/kbtysky2x8fZLW8osP/source.gif');

                msg.channel.send(BestEmbed);

            });
            return;

        }

        if (command === "user") {
            const usern = args.join(" ");
            msg.delete().catch(O_O => { });
            osuApi.getUser({ u: `${usern}` }).then(user => {

                const BestEmbed = new Discord.RichEmbed()
                    .setColor("#FFB6C1")
                    .setTitle(`PP Results for : ${usern}`)
                    .addBlankField()
                    .addField("Total PP = " + user.pp.raw, "‎", false)
                    .addField("Rank = #" + user.pp.rank, "‎", false)
                    .addField("Country Rank = #" + user.pp.countryRank, "‎", false)
                    .setTimestamp()
                    .setFooter('Designed with love', 'https://media.giphy.com/media/kbtysky2x8fZLW8osP/source.gif');

                msg.channel.send(BestEmbed);
            });
            return;
        }

        if (command === "lxwfi") {
            osuApi.getUserBest({ u: 'LxwFi' }).then(scores => {
                msg.channel.send(scores[0].score);
                msg.channel.send(scores[0].maxCombo);

            });
        }


        if (command === "beatcover") {
            const beatcoverid = args.join(" ");
            msg.delete().catch(O_O => { });
            msg.channel.send(`https://assets.ppy.sh/beatmaps/${beatcoverid}/covers/cover.jpg`);
            return;
        }

        if (command === "beatthumb") {
            const beatcoverid = args.join(" ");
            msg.delete().catch(O_O => { });
            msg.channel.send(`https://b.ppy.sh/thumb/${beatcoverid}l.jpg`);
            return;
        }



        if (command === "userpfp") {
            const userpfpid = args.join(" ");
            msg.delete().catch(O_O => { });
            msg.channel.send(`http://s.ppy.sh/a/${userpfpid}`);
            return;
        }

        // if (command === "ddd") {
        //     const oid = osuApi.;
        //     bot.channels.get(od).send(oid);
        //     return;
        // }



        if (command === "beathelp") {
            msg.channel.send(`If you use "+beatcover (numbers)" and you get just the link, it is not a valid beatmap, same with every other command where you put ID's`);
            return;
        }



    }
});


// Create a stream to follow tweets
const stream = twitterClient.stream('statuses/filter', {

    follow: ['1011185550676709377', '989901172843655168', '1007103242356969472', '4923993500', '3238641808',]

});

// twitter stuff
var twitcounter = 0;
function isReply(tweet) {
    if (tweet.retweeted_status
        || tweet.in_reply_to_status_id
        || tweet.in_reply_to_status_id_str
        || tweet.in_reply_to_user_id
        || tweet.in_reply_to_user_id_str
        || tweet.in_reply_to_screen_name)
        return true
}
stream.on('tweet', tweet => {

    if (isReply(tweet)) {
        twitcounter++
    }
    else {
        const twitterMessage = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`
        const twitterDesc = `__**${tweet.user.name} (@${tweet.user.screen_name})    tweeted**__`
        bot.channels.get(d).send(twitterDesc);
        bot.channels.get(d).send(twitterMessage);
    }
});



// this is just to give me an idea of replies, useless comand otherwise
// this is also entirely useless and just cloggs up the bot most the time

// if (isReply(tweet)) {
//     let color = ((1 << 24) * Math.random() | 0).toString(16);
//     const SpamEmbed = new Discord.RichEmbed()
//         .setColor(color)
//         .setTitle("Someone posted spam, version " + color + " !")
//         .setThumbnail('https://thumbs.gfycat.com/FeistyHeftyAmericanbobtail-max-1mb.gif')
//         .setTimestamp()
//         .setFooter('Designed with love', 'https://thumbs.gfycat.com/FeistyHeftyAmericanbobtail-max-1mb.gif');
//     bot.channels.get(spam).send(SpamEmbed)
// }

// 300000 = 5 min 
// 60000 = 1 min
// 10000 = 10 seconds
// 1000 = 1 second



//Ping + say command
bot.on("message", async msg => {
    if (msg.author.bot) return;
    const args = msg.content.slice(process.env.affix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    try {
        if (command === "ping") {
            const m = await msg.channel.send("Ping?");
            m.edit(`Pong! Latency is ${m.createdTimestamp - m.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);

        }
    }
    catch (exception) { console.log(exception); }


    if (command === "say") {
        const sayMessage = args.join(" ");
        msg.delete().catch(O_O => { });
        msg.channel.send(sayMessage);
        return;
    }

})

// message listeners
bot.on("message", async msg => {
    if (!msg.author.bot) {

        //avatar
        if (msg.content.toLowerCase() === "what is my avatar" || msg.content.toLowerCase() === "what is my avatar?") {
            msg.channel.send(msg.author.avatarURL);
            return;
        }
        // this is entirely useless and was just made for my general interest
        if (msg.content.toLowerCase() === "!spam") {
            msg.channel.send("Started Tracking");
            setInterval(() => {
                bot.channels.get(spam).send(`( ${twitcounter} )` + " = spam");
                return;
            }, 600000);
            return;
        }





        //Number 1-100
        if (msg.content.toLowerCase() === "!random" || msg.content.toLowerCase() === "random!") {
            let rndm = randomNumber()
            msg.reply(rndm)
            return;
        }
        // everyone codes this haha
        if (msg.content.toLowerCase() === "ping" || msg.content.toLowerCase() === "ping!") {
            msg.channel.send("Pong!");
            return;
        }


        /*
        
             This is another form of the +ping command from earlier
        
            if(msg.content == "ping"){
                    msg.channel.send("Pinging ...")
                    .then((msg) => {
                        msg.edit("Ping: " + (Date.now() - msg.createdTimestamp))
                    });
                }
        */


        // one of the very first commands i wrote
        if (msg.content.toLowerCase() === "hi") {
            msg.channel.send("Hello!");
            return;
        }




        //  if (msg.content.toLowerCase() === "(insert word)") {
        //      msg.delete()
        //      msg.reply("Don't say that! >:(")
        //      return;
        //   }




        //     let color = ((1 << 24) * Math.random() | 0).toString(16);
        //     .setColor(`#${color}`)
        //     If you want a random colour on your embed instead of the purple i set, just copy paste that code above into the section bellow
        //     ".setColor("0x800080")"

        const Embed = new Discord.RichEmbed()
            .setColor("0x800080")
            .setTitle("FidelityBot info")
            .setAuthor('Info!', 'https://media.giphy.com/media/kbtysky2x8fZLW8osP/source.gif')
            .setDescription('Hey! I am a bot coded by LxwFi!')
            .setThumbnail('https://data.whicdn.com/images/322396759/large.jpg')
            .addField('What do i do?', 'Currently I am being used as a twitter + osu bot for my owner! But i do have some other features!')
            .addBlankField()
            .addField('What is my prefix?', 'My prefix is = "+"', true)
            .addField('How do i get you to say stuff?', '+say followed by your message', true)
            .addField('How do i get my avatar?', 'Simply write "what is my avatar?" and i will do the work', true)
            .addField('What other commands do i have?', '+ping for latency, !random for a 1-100 number and some osu commands that are being worked on!', true)
            .setTimestamp()
            .setFooter('Designed with love', 'https://media.giphy.com/media/kbtysky2x8fZLW8osP/source.gif');


        // embed that gets sent to your dms
        if (msg.content.toLowerCase() === ".whoami?" || msg.content.toLowerCase() === ".whoami") {
            const user = bot.users.get("<id>");
            msg.author.send(Embed)
            msg.channel.send("I have DM'ed you the message! Make sure you have DM's enabled!")
            return;
        }

        // just something simple to see if the bot is responding
        if (msg.content.toLowerCase() === "check123") {
            msg.channel.send("I am working!")
            return;
        }



        //Picture of anomaly
        if (msg.content.toLowerCase() === "anomaut") {
            msg.delete()
            msg.channel.send({ files: ['https://cdn.discordapp.com/attachments/650059612892168193/650061296250781696/autism.png'] });
            return;
        }









    }
})


