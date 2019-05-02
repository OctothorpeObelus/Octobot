const Jimp = require('jimp');

exports.trumped = function(trumpargs, message) {
    if (trumpargs.length < 2 | trumpargs.length > 2) {
        return "You must mention a user";
    } else if (trumpargs[1].substring(0, 4) == "http") {
        console.log("[CMD LOG] $trump, used url");
        const trumpurl = await message.channel.send("Processing...");
        let jimpsurl = ['images/trump_bkg.png', 'images/trump_picture_frame.png', trumpargs[1]]
        let jimpedurl = [Jimp.read(jimpsurl[0]), Jimp.read(jimpsurl[1]), Jimp.read(jimpsurl[2])]
    
        Promise.all(jimpedurl).then(function(data) {return Promise.all(jimpedurl)})
        .then(function(data) {
            data[2].resize(Jimp.AUTO, 760)
            data[0].composite(data[2], -(data[2].bitmap.width / 2) + 406, 94)
            data[0].composite(data[1], 0, 0)
            data[0].write("images/generated/trumped.png")
        })
        .catch(err => {throw err})
    } else if (trumpargs.length == 2 & message.mentions.users.first(1)[0].id != -1) {
        if (trumpargs[1].substring(0, 1) == "<") {
            console.log("[CMD LOG] $trump, used mention");
            const trump = await message.channel.send("Processing...");
            let jimps = ['images/trump_bkg.png', 'images/trump_picture_frame.png', message.mentions.users.first(1)[0].avatarURL]
            let jimped = [Jimp.read(jimps[0]), Jimp.read(jimps[1]), Jimp.read(jimps[2])]
            
            Promise.all(jimped).then(function(data) {return Promise.all(jimped)})
            .then(function (data) {
                data[2].resize(760, 760)
                data[0].composite(data[2], 55, 94)
                data[0].composite(data[1], 0, 0)
                data[0].write("images/generated/trumped.png")
            })
            .catch(err => {throw err})
        } else {
            findUser(trumpargs[1]);
            return;
        }
    }
}

exports.mariouser = function(user, message) {
    let jimps = ['images/mario_bkg.png', 'images/mario_frg.png',  (message.mentions.users.first(1)[0].id != -1)?message.mentions.users.first(1)[0].avatarURL:message.server.members.get("name", user).avatarURL]
    let jimped = [Jimp.read(jimps[0]),Jimp.read(jimps[1]),Jimp.read(jimps[2])]
    
    Promise.all(jimped).then(function(data) {return Promise.all(jimped)})
    .then(function(data) {
        data[2].resize(256, 256)
        data[0].composite(data[2], 55, 94)
        data[0].composite(data[1], 0, 0)
        data[0].write("images/generated/mario.png")
    })
    .catch(err => {console.log(err)})
}

exports.mariotext = function(text, message) {
    let jimps = ['images/mario_bkg.png', 'images/mario_frg.png']
    let jimped = [Jimp.read(jimps[0]),Jimp.read(jimps[1])]
    
    Promise.all(jimped).then(function(data) {return Promise.all(jimped)})
    .then(function(data) {
        data[2].resize(256, 256)
        Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then(font => {
            data[0].print(
                font,
                10,
                10,
                {
                    text: text,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
                },
                64,
                64
            );
        })
        data[0].composite(data[1], 0, 0)
        data[0].write("images/generated/mario.png")
    })
    .catch(err => {console.log(err)})
}

exports.ahshit = function(user, message) {
    let jimps = ['images/carl_frg.png',  (message.mentions.users.first(1)[0].id != -1)?message.mentions.users.first(1)[0].avatarURL:message.server.members.get("name", user).avatarURL]
    let jimped = [Jimp.read(jimps[0]),Jimp.read(jimps[1])]
    
    Promise.all(jimped).then(function(data) {return Promise.all(jimped)})
    .then(function(data) {
        data[2].resize(256, 256)
        data[0].composite(data[2], 55, 94)
        data[0].composite(data[1], 0, 0)
        data[0].write("images/generated/ahshit.png")
    })
    .catch(err => {console.log(err)})
}
