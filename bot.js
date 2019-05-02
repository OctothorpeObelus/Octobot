const Discord = require("discord.js");
const fs = require("fs");

const client = new Discord.Client();

const config = require("./config.json");
const subnetting = require("./subnetting.js");
const images = require("./images.js");

const Jimp = require('jimp');

const http = require('http')

const https = require('https')

let wavFileInfo = require('wav-file-info');

const si = require('systeminformation');

let ops = fs.readFileSync("./ops.list").toString().split("\n");

let chance = require('./chance.js');

const audioconcat = require('audioconcat')

for (i in ops) ops[i] = parseInt(ops[i]);

const commands = ["info", "op [mention] (op only)", "deop [mention] (op only)", "restart (op only)", "delete (op only)", "purge [int] (op only)", "8", "ping", "meme (tag)", "memetags", "trump (url/user mention)", "wall (url/user mention)", "find (partial/full nickname/username)", "subnet (number of hosts)"]
const vcmands = ["vox (query)", "leave", "pizzatime"]
// Arrays and such that need constant
const ballchoices = ["It is certain", "It is decidedly so", "Without a doubt", "Yes - defintitely", "You may rely on it", "As I see it, yes", "Most Likely", "Outlook good", "Yes.", "Signs point to yes", "Don't count on it bud", "Nae", "My totally unbiased sources say no", "Outlook not so good", "Very Doubtful", "Reply is hazy, but my best guess says no"];

let voiceChannel;
let voiceConnection;

let queue = []

function findUser(key) {
    return key;
}

function voxrun() {

    for (let i = 0; i < voxargs.lenth; i++) {
        voxargs[i] = voxargs[i] + ".wav"
    }

    audioconcat(voxargs)
        .concat('./vox/lastvox.mp3')
        .on('start', function (command) {
            console.log('ffmpeg process started:', command)
        })
        .on('error', function (err, stdout, stderr) {
            console.error('Error:', err)
            console.error('ffmpeg stderr:', stderr)
        })
        .on('end', function (output) {
            console.error('Audio created in:', output)
        })
    dispatcher = voiceConnection.playFile('./vox/lastvox.mp3');
    return;
}

function getMember(guild, identifier) {
    identifier = identifier.toLowerCase()
    return guild.members.find(x => x.id === identifier || x.user.username.toLowerCase().includes(identifier) || ((x.nickname !== null) ? x.nickname.toLowerCase().includes(identifier) : false))
}

client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity(config.activity);
});

client.on("message", async message => {
    try {
        if (message.channel.type == "dm") return;
        //if (message.author.bot) return;
        
        if (message.guild.id == 427943354316357641 && message.channel.id == 540169251261120524 && message.author.id == 407903863778312196) {
            console.log("Message retrieved")
            console.log(message.content)
        }

        const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        if (message.content.substring(0, 1) != config.prefix) return;


        // Op only commands
        if (ops.indexOf(parseInt(message.author.id)) != -1 || message.author.id == config.creator) {
            if (command === "op") {
                if (!message.mentions.users.first(1)[0]) return;

                if (ops.indexOf(parseInt(message.mentions.users.first(1)[0].id)) != -1) {
                    message.channel.send("It appears that this user is already opped.");
                    return;
                }

                ops.push(parseInt(message.mentions.users.first(1)[0].id));

                message.channel.send("User opped.");

                fs.writeFile("./ops.list", ops.join("\n"), (err) => {
                    if (err) throw err;
                });
            }

            if (command === "deop") {
                if (!message.mentions.users.first(1)[0]) return;

                if (ops.indexOf(parseInt(message.mentions.users.first(1)[0].id)) == -1) {
                    message.channel.send("It appears that this user isn't opped.");
                    return;
                }

                ops.splice(ops.indexOf(parseInt(message.mentions.users.first(1)[0].id)), 1);

                message.channel.send("User deopped.");

                fs.writeFile("./ops.list", ops.join("\n"), (err) => {
                    if (err) throw err;
                });
            }

            if (command === "delete") {
                if (args[0]) {
                    let k = parseInt(args[0])
                    if (k) {
                        if (k > 100) k = 100;
                        message.channel.fetchMessages({ limit: k }).then(function (res) {
                            arr = res.array()
                            let num = 0;
                            for (i in arr) {
                                if (arr[i].author.id == client.user.id) {
                                    arr[i].delete();
                                    num += 1;
                                }
                            }
                            console.log("Deleted " + num + " messages.");
                        });
                    }
                }
            }

            if (command === "purge") {
                if (args[0]) {
                    let sender = message.author.username
                    let k = parseInt(args[0]) + 1
                    if (k) {
                        if (k > 100) k = 100;
                        message.channel.fetchMessages({ limit: k }).then(function (res) {
                            arr = res.array()
                            let num = 0;
                            for (i in arr) {
                                    arr[i].delete();
                                    num += 1;
                            }
                            console.log("Deleted " + (num-1) + " messages. Command issued by " + sender);
                        });
                    }
                }
            }

            if (command === "restart") {
                m = await message.channel.send("Restarting!");
                process.exit();
            }

            if (message.guild.id == "385997609229352970" | message.author.id == config.creator) {
                if (command == "poll") {
                    let pollargs = message.content.split("(")
                    console.log(pollargs)
                    let pollout = "";

                    for (let i = 2; i < pollargs.length; i++) {
                        if (i > 11) { break; }
                        pollout += (i - 1) + ") " + pollargs[i] + "\n"
                    }
                    console.log(pollout)
                    console.log(message.guild.iconURL)

                    message.channel.send({
                        embed: {
                            color: 0xff0000,
                            author: {
                                name: message.author.username,
                                icon_url: message.author.avatarURL
                            },
                            thumbnail: {
                                url: message.guild.iconURL
                            },
                            fields: [
                                {
                                    name: pollargs[1],
                                    value: pollout
                                },
                                {
                                    name: "__How to vote__",
                                    value: "Select the reaction number corresponding with your choice"
                                }
                            ],
                            timestamp: new Date()
                        }
                    })
                        .then(function (message) {
                            //for (let i=2;i<pollargs.length+2;i++) {
                            //if (i=2) {poll.react("545749638683164678")}
                            //}
                            try {
                                message.react("1️⃣")
                            } catch (err) {
                                message.channel.send("Internal error: " + err.message)
                            }
                        })
                    message.delete()
                }
            }
        }
        // End op only commands
        if (message.guild.id != "385997609229352970") {

            if (command == "find") {
                let findargs = message.content.substring(6)
                try {
                    message.channel.send(getMember(message.guild, findargs).displayName)
                } catch (err) {
                    message.channel.send('Internal error: ' + err.message)
                }
            }

            if (command == "info") {
                let info = ""
                for (let i = 0; i < commands.length; i++) {
                    info += config.prefix + commands[i] + "\n"
                }
                let vcinfo = ""
                for (let i = 0; i < vcmands.length; i++) { vcinfo += config.prefix + vcmands[i] + "\n" }
                message.channel.send({
                    embed: {
                        color: 0xff0000,
                        author: {
                            name: message.author.username,
                            icon_url: message.author.avatarURL
                        },
                        title: "",
                        fields: [{
                            name: "Text Commands",
                            value: `${info}`
                        },
                        {
                            name: "Voice Chat Commands",
                            value: `${vcinfo}`
                        }
                        ],
                        timestamp: new Date()
                    }
                });
            }

            if (command == "8") {
                try {
                    let ballchoice = ballchoices[Math.round(Math.random() * 15) + 1]
                    message.channel.send(ballchoice);
                } catch (err) {
                    message.channel.send("Internal error: " + err)
                }
            }

            if (command == "ping") {
                const m = await message.channel.send("Ping?");
                m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
            }

            if (command == "trump") {
                let trumpargs = message.content.split(" ")
                //message.channel.send("[DEBUG] Args returned as {" + trumpargs + "}")
                await images.trumped(trumpargs)
                .then(
                    message.channel.send({
                        embed: {
                            color: 0xff0000,
                            author: {
                                name: message.author.username,
                                icon_url: message.author.avatarURL
                            },
                            title: "Generated Trump image",
                            timestamp: new Date()
                        }
                    });
                    message.channel.send({ file: 'images/generated/trumped.png' })
                    trump.delete();
                )
            }

            if (command == "vctime") {
                let channelList = message.guild.channels.array();
                for (let i = 0; i < channelList.length; i += 1) {
                    if (channelList[i].type == "voice") {
                        userList = channelList[i].members.array();
                        for (let j = 0; j < userList.length; j += 1) {
                            if (message.author.id == userList[j].id) {
                                voiceChannel = channelList[i];
                                channelList[i].join().then(connection => {
                                    voiceConnection = connection;
                                    let dispatcher = connection.playFile('./vox/thetimeis.wav');
                                    console.log("Joined the channel");
                                    dispatcher.on("end", end => {
                                        console.log("Left the channel");
                                        voiceChannel.leave();
                                    });
                                }).catch(console.error);
                                return;
                            }
                        }
                    }
                }
            }

            if (command == "pizzatime") {
                let channelList = message.guild.channels.array();
                for (let i = 0; i < channelList.length; i += 1) {
                    if (channelList[i].type == "voice") {
                        userList = channelList[i].members.array();
                        for (let j = 0; j < userList.length; j += 1) {
                            if (message.author.id == userList[j].id) {
                                voiceChannel = channelList[i];
                                channelList[i].join().then(connection => {
                                    voiceConnection = connection;
                                    let dispatcher = connection.playFile('./audio/pizzatime.wav');
                                    console.log("Joined the channel");
                                    dispatcher.on("end", end => {
                                        console.log("Left the channel");
                                        voiceChannel.leave();
                                    });
                                }).catch(console.error);
                                return;
                            }
                        }
                    }
                }
            }

            if (command == "vox") {
                let flag = 0
                var voxargs = message.content.split(" ")
                for (let i = 0; i < voxargs.length; i++) { voxargs[i] = voxargs[i].toLowerCase() }
                var vox = 1
                var channelList = message.guild.channels.array();
                var files = fs.readdirSync('./vox/');
                for (let i = 0; i < channelList.length; i += 1) {
                    if (channelList[i].type == "voice") {
                        userList = channelList[i].members.array();
                        for (let j = 0; j < userList.length; j += 1) {
                            if (message.author.id == userList[j].id) {
                                voiceChannel = channelList[i];
                                channelList[i].join().then(connection => {
                                    voiceConnection = connection;
                                    voxargs.shift();
                                    for (let i = 0; i < voxargs.length; i++) {
                                        console.log(voxargs[i] + ".mp3")
                                        if (!files.includes(voxargs[i] + ".mp3")) {
                                            voxargs[i] = "./vox/sil.mp3"
                                        } else {
                                            voxargs[i] = "./vox/" + voxargs[i] + ".mp3"
                                        }
                                    }
                                    voxargs.push("./vox/sil.mp3")
                                    flag = 1
                                    audioconcat(voxargs)
                                        .concat('./vox/lastvox.mp3')
                                        .on('start', function (command) {
                                            console.log('ffmpeg process started:', command)
                                        })
                                        .on('error', function (err, stdout, stderr) {
                                            console.error('Error:', err)
                                            console.error('ffmpeg stderr:', stderr)
                                        })
                                        .on('end', function (output) {
                                            console.error('Audio created in:', output)
                                            dispatcher = voiceConnection.playFile('./vox/lastvox.mp3');
                                        })

                                    return;
                                }).catch(console.error);
                                return;
                            }
                        }
                    }
                }
                if (!flag) {
                    console.log("[$vox] No VC found for " + message.author.username + ", uploading file to chat instead.")
                    voxargs.shift();
                    for (let i = 0; i < voxargs.length; i++) {
                        console.log(voxargs[i] + ".mp3")
                        if (!files.includes(voxargs[i] + ".mp3")) {
                            voxargs.splice(i, 1)
                            i--
                        } else {
                            voxargs[i] = "./vox/" + voxargs[i] + ".mp3"
                        }
                    }
                    await audioconcat(voxargs)
                        .concat('./vox/lastvox.mp3')
                        .on('start', function (command) {
                            console.log('ffmpeg process started:', command)
                        })
                        .on('error', function (err, stdout, stderr) {
                            console.error('Error:', err)
                            console.error('ffmpeg stderr:', stderr)
                        })
                        .on('end', function (output) {
                            console.error('Audio created in:', output)
                            message.channel.send({ file: './vox/lastvox.mp3' })
                        })
                }
            }

            if (command == "leave") {
                voiceChannel.leave();
                console.log("Left the channel");
            }

            if (command == "activity" & message.author.id == config.creator) {
                actiletgs = message.content.substring(10)
                message.delete();
                client.user.setActivity(actiletgs);
            }

        }

        if (message.guild.id == "385997609229352970") {
            if (command == "info") {
                message.channel.send({
                    embed: {
                        color: 0x9999ff,
                        author: {
                            name: message.author.username,
                            icon_url: message.author.avatarURL
                        },
                        title: "$info",
                        fields: [{
                            name: "Commands",
                            value: "$info - Shows available commands\n$poll - (OP Only) $poll (Title (Option 1 (Option 2 ... MUST USE LEFT PARENTHESES BEFORE EACH OPTION"
                        }],
                        timestamp: new Date()
                    }
                });
                message.delete()
            }

        }
        console.log(message.guild.id)

        if (command == "sys") {
            async function cpu() {
                try {
                    const sysdata = await si.cpuTemperature();
                    const sysdata2 = await si.cpuCurrentspeed();
                    const sysdata3 = await si.cpu();
                    const sysdata4 = await si.mem();

                    let sysinfo = 'Manufacturer: ';
                    sysinfo += JSON.stringify(sysdata3.manufacturer);
                    sysinfo += '\nTemp (°C): ';
                    sysinfo += JSON.stringify(sysdata.main);
                    sysinfo += '\nClock Speed (GHz per core): ';
                    sysinfo += JSON.stringify(sysdata2.cores);
                    sysinfo += '\nFree Ram (Megabytes): ';
                    sysinfo += parseFloat(JSON.stringify(((sysdata4.free) / 1000000))).toLocaleString('en');
                    message.channel.send(sysinfo);
                } catch (e) {
                    console.log(e)
                }
            }
            cpu();
        }

        if (command == "wall") {
            let wallargs = message.content.split(" ")

            if (wallargs.length < 2 | wallargs.length > 2) {
                message.channel.send("You must mention a user");
                return;
            } else if (wallargs[1].substring(0, 4) == "http") {
                console.log("[CMD LOG] $trump, used url");
                const wallurl = await message.channel.send("Processing...");
                let jimpsurl = ['images/wall.png', 'images/overlay.png', wallargs[1]]
                let jimpedurl = [Jimp.read(jimpsurl[0]), Jimp.read(jimpsurl[1]), Jimp.read(jimpsurl[2])]

                message.delete()

                Promise.all(jimpedurl).then(function (data) {
                    return Promise.all(jimpedurl);
                })
                    .then(function (data) {
                        data[2].resize(Jimp.AUTO, 410)
                        data[2].posterize(8)
                        data[2].color([{ apply: "desaturate", params: [30] }])
                        data[0].composite(data[2], -(data[2].bitmap.width / 2) + (data[0].bitmap.width / 2.25), -(data[2].bitmap.height / 2) + (data[0].bitmap.height / 1.75))
                        data[0].composite(data[1], 0, 0)
                        data[0].write("images/generated/walled.png", function () {
                            message.channel.send({
                                embed: {
                                    color: 0xff0000,
                                    author: {
                                        name: message.author.username,
                                        icon_url: message.author.avatarURL
                                    },
                                    title: "Generated Aged Wall Mural image",
                                    timestamp: new Date()
                                }
                            });
                            message.channel.send({ file: 'images/generated/walled.png' })
                            wallurl.delete();
                        })
                    })
                    .catch(err => {
                        throw err;
                    })
            } else if (wallargs.length == 2 & message.mentions.users.first(1)[0].id != -1) {
                if (wallargs[1].substring(0, 1) == "<") {
                    console.log("[CMD LOG] $trump, used mention");
                    const wall = await message.channel.send("Processing...");
                    let jimps = ['images/wall.png', 'images/overlay.png', message.mentions.users.first(1)[0].avatarURL]
                    let jimped = [Jimp.read(jimps[0]), Jimp.read(jimps[1]), Jimp.read(jimps[2])]

                    message.delete()

                    Promise.all(jimped).then(function (data) {
                        return Promise.all(jimped);
                    })
                        .then(function (data) {
                            data[2].resize(410, 410)
                            data[2].posterize(8)
                            data[2].color([{ apply: "desaturate", params: [30] }])
                            data[0].composite(data[2], -(data[2].bitmap.width / 2) + (data[0].bitmap.width / 2.25), -(data[2].bitmap.height / 2) + (data[0].bitmap.height / 1.75))
                            data[0].composite(data[1], 0, 0)
                            data[0].write("images/generated/walled.png", function () {
                                message.channel.send({
                                    embed: {
                                        color: 0xff0000,
                                        author: {
                                            name: message.author.username,
                                            icon_url: message.author.avatarURL
                                        },
                                        title: "Generated Aged Wall Mural image",
                                        timestamp: new Date()
                                    }
                                });
                                message.channel.send({ file: 'images/generated/walled.png' })
                                wall.delete();
                            })

                        })
                        .catch(err => {
                            throw err;
                        })
                } else {
                    findUser(wallargs[1]);
                    return;
                }
            }
        }

        if (command == "dice") {
            message.channel.send(chance.dice(message));
        }

        if (message.author.id == config.creator & command == "say") {
            message.channel.send(message.content.substring(5));
            message.delete();
        }

        if (command == "meme") {
            let data = ''
            let args = JSON.stringify({ Tag: message.content.substring(6) })
            let options = {
                hostname: 'api.memes.fyi',
                path: '/Videos/Random',
                method: 'POST',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(args)
                }
            }

            let req = https.request(options, res => {
                res.setEncoding('utf8')
                res.on('data', x => data += x)
                res.on('end', () => {
                    data = JSON.parse(data)
                    if (data.Status === 200) {
                        let niceURL = `https://memes.fyi/v/${data.Data.Key}`
                        message.channel.send(`Here's a spicy ${(message.content.substring(6) != null) ? `${message.content.substring(6)} ` : ''}meme, uploaded by ${data.Data.Username}.\n${niceURL}`)
                    } else {
                        message.channel.send(`${data.StatusMessage} (${data.Status})`)
                    }
                })
            })

            req.on('error', err => message.channel.send(txt.err_no_connection))
            req.write(args)
            req.end()
        }

        if (command == "memetags") {
            message.channel.send("https://dank.memes.fyi/Tags")
        }

        if (command == "soulsteal") {
            message.channel.send({
                embed: {
                    color: 0xff0000,
                    author: {
                        name: message.author.username,
                        icon_url: message.author.avatarURL
                    },
                    image: { url: "https://cdn.discordapp.com/attachments/466322280541323264/547627460318068737/SOULEATER1.gif" },
                    title: "soulsteal",
                }
            });
        }

        if (command == "subnet") {
            let args = message.content.split(" ")

            if (args[1] > 2 && !isNaN(args[1]) && args[1] <= 2147483648) {
                subnetting.subnettable(args[1])
                    .then(() => {
                        message.channel.send(subnetting.subnetinfo(args[1]), { file: "subnet_table.csv" });
                        //message.channel.send("", { file: "subnet_table.csv" });
                    });
            } else { message.channel.send("Request denied, query was not a number or number was out of range") }
        }
        
        if (command == "ahshit") {
            await images.ahshit(message)
            message.channel.send({file: "./generated/ahshit.png"})
        }
        
    } catch (err) {
        message.channel.send('Internal error: ' + err)
    }
});

client.login(config.token);
