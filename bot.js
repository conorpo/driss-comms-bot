const path = require('path');
const fs = require('fs');
const Discord = require('discord.js');

const config = {
    token: process.env.TOKEN,
    prefix: '>',
    audioFiles: [],
}

const ID_AUDIO_ASSOCIATIONS = {
    "671478563446194202": "driss_1",
    "692699440800071712": "driss_2",
    "692699665203986442": "501st",
    "692699724381159435": "dreaded",
    "692699798507356190": "autism_brigade",
    "692789826478538873": "driss_6",
    "692465475895951491": "cyber_bullies",
    "692789871328231575": "driss_7",
    "692839778810331136": "driss_8",
    "692839845415878684": "driss_9",
    "692839877578064014": "driss_10"

}

fs.readdir(path.join(__dirname,'sounds'), (err, files) => {
    if (err) return console.log(err);
    config.audioFiles.push(...files.map(file => file.slice(0, file.indexOf('.'))));
})


const client = new Discord.Client();

client.on('message', message => {

    const guild = message.member.guild;
    
    if (message.author.id !== '118098246655672329') {
        if (guild.disabled) return;

        if (message.author.bot) return;
    
        if (!message.member.roles.cache.has('message.member.roles.cache')) return; 

        if (!message.content.startsWith(config.prefix)) return;
    }

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command == "alert") {
        const soundFile = ID_AUDIO_ASSOCIATIONS[message.member.voice.channelID] || 'driss_1';
        
        messageAll("join", guild, soundFile,message.member.voice.channelID);
    } else if(command == "help") {
        const soundFile = ID_AUDIO_ASSOCIATIONS[message.member.voice.channelID] || 'driss_1';
        
        messageAll("help", guild, soundFile,message.member.voice.channelID);
    }
})

async function messageAll(startingMessage, guild, soundFile, ogId) {

    const voiceChannels = guild.channels.cache.filter(channel => channel.type === "voice");

    for(const [key, value] of voiceChannels) {
        if (key == ogId) {continue;}
        const connection = await value.join();

        await audioHandler(startingMessage, soundFile, connection);
    }
}


const audioHandler = function(startingMessage, file, connection){
    return new Promise((res, rej) => {
        connection.play(path.join(__dirname, 'sounds', `${startingMessage}.wav`));
        setTimeout(() => {
            const audioStream = connection.play(path.join(__dirname, 'sounds', `${file}.wav`));
            audioStream.on("speaking", (value) => {
                if (!value) {
                    res('lol');
                }
            })
        }, 2000);
    })
}

client.login(config.token);

module.exports = audioHandler;