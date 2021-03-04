'use strict';

const { Client, MessageEmbed } = require('discord.js');
const Discord = require('discord.js')
const client = new Discord.Client()

const fs = require('fs');
const path = require('path')
const { prefix } = require("./config.json");

const config = require('./config.json')
const poll = require('./poll')
const mongo = require('./mongo')
const roleClaim = require('./role-claim')
const privateMessage = require('./private-message')
const command = require('./command');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Churonix:xuli9441670@cluster0.ixxzq.mongodb.net/Data', { useNewUrlParser: true, useUnifiedTopology: true})

client.on('ready', async () => {
  console.log('I am ready!')

  const baseFile = 'command-base.js'
  const commandBase = require(`./commands/${baseFile}`)

  const readCommands = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir))
    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file))
      if (stat.isDirectory()) {
        readCommands(path.join(dir, file))
      } else if (file !== baseFile) {
        const option = require(path.join(__dirname, dir, file))
        commandBase(client, option)
      }
    }
  }

  readCommands('commands')

  poll(client)

  client.users.fetch('739514278494732309').then((user) => {
    user.send('```Automoderations- System. Vers. 1.0.0\n|| Der Bot ist Online!```')
  })

  client.users.fetch('492726538358489096').then((user) => {
    user.send('```Automoderations- System. Vers. 1.0.0\n|| Der Bot ist Online!```')
  })

  client.users.fetch('621380620303466517').then((user) => {
    user.send('```Automoderations- System. Vers. 1.0.0\n|| Der Bot ist Online!```')
  })

  privateMessage(client, 'ping', 'Pong!')

  command(client, 'createtextchannel', (message) => {
    const name = message.content.replace('&createtextchannel ', '')

    message.guild.channels
      .create(name, {
        type: 'text',
      })
      .then((channel) => {
        const categoryId = '809485123305078845'
        channel.setParent(categoryId)
      })
  })

  command(client, 'createvoicechannel', (message) => {
    const name = message.content.replace('&createvoicechannel ', '')

    message.guild.channels
      .create(name, {
        type: 'voice',
      })
      .then((channel) => {
        const categoryId = '807222547854786580'
        channel.setParent(categoryId)
        channel.setUserLimit(10)
      })
  })
});

client.on('message', (msg) =>{
  if(msg.author.bot || msg.channel.type == "dm" || msg.channel.type== 'group')return
  if(msg.content.startsWith(prefix) != true)return
  if(msg.content.startsWith(`&testmember`)){
        if(msg.author.id != 739514278494732309)
       msg.guild.members.get(client.user.id).setNickname(`T I @${member.id}`)
    }
  })

privateMessage(client, 'ping', 'Pong!')

client.on('message', message => {
  if (message.content === 'gonzo') {
    message.channel.send('Gonzo Stinkt!');
  }
});

client.on('message', message => {

  if (message.content === '&serverinfo') {
  
    const embed = new MessageEmbed()
    .setColor("RANDOM")
    .setTitle("Server Info")
    .setImage(message.guild.iconURL)
    .setDescription(`${message.guild}'s informationen`)
    .addField("Owner", `der Server Owner ist: ${message.guild.owner}`)
    .addField("Member Count", `der Server hat ${message.guild.memberCount} Members`)
    .setTimestamp()
    .setFooter(client.user.username, client.user.avatarURL);
    
    message.channel.send({embed});
};
});

client.on('message', message => {

  if (message.content === '&help') {

    const embed = new MessageEmbed()
    .setColor("RANDOM")
    .setTitle("Hilfe")
    .setImage("https://cdn.discordapp.com/attachments/801012740038197280/808274324439695371/60c87de52ae02794c0c10e283eaf646b-pineapple-cartoon.png")
    .setDescription("Hilfe zu den Bot- Befehle.")
    .addField("&help allgemein", `Um allgemeine Befehle zu sehen.`)
    .addField("&help moderation", `Um die Moderations- Befehle anzuzeigen.(Nur Moderatoren)`)
    .addField("&help leitung", `Um die Befehle der Admistration zu sehen.`)
    .setTimestamp()
    .setFooter(client.user.username, client.user.avatarURL);
  
    message.channel.send({embed});
};
});

client.on('message', message => {

  if (message.content === '&help allgemein') {

    const embed = new MessageEmbed()
    .setColor("RANDOM")
    .setTitle("Allgemeine Informationen")
    .setDescription("Hilfe zu den Bot- Befehle.")
    .addField("&abstimmung", `Um eine Abstimmung für die letzte Nachricht starten.`)
    .addField("&serverinfo", `Um Informationen über den Server zu erhalten.`)
    .addField("&createtextchannel", `Um Text-Kanal im Forum zu erstellen.`)
    .addField("&createvoicechannel", `Um Sprach-Kanal zu erstellen.`)
    .setTimestamp()
    .setFooter(client.user.username, client.user.avatarURL);
  
    message.channel.send({embed});
};
});

client.on('message', message => {

  if (message.content === '&help moderation') {

    const embed = new MessageEmbed()
    .setColor("RANDOM")
    .setTitle("Informationen zur Moderation")
    .setDescription("Hilfe zu den Bot- Befehle.")
    .addField("&ban", `&ban <user> <begründung>`)
    .addField("&kick", `&kick <user> <begründung>`)
    .setTimestamp()
    .setFooter(client.user.username, client.user.avatarURL);
  
    message.channel.send({embed});
};
});

client.on('message', message => {

  if (message.content === '&help leitung') {

    const embed = new MessageEmbed()
    .setColor("RANDOM")
    .setTitle("Informationen zur Admistration")
    .setDescription("Hilfe zu den Bot- Befehle.")
    .addField("Noch keine verfügbar", `Cooming Soon!`)
    .setFooter(client.user.username, client.user.avatarURL);
  
    message.channel.send({embed});
};
});

command(client, 'ban', (message) => {
  const { member, mentions } = message

  const tag = `<@${member.id}>`

  if (
    member.hasPermission('ADMINISTRATOR') ||
    member.hasPermission('BAN_MEMBERS')
  ) {
    const target = mentions.users.first()
    if (target) {
      const targetMember = message.guild.members.cache.get(target.id)
      targetMember.ban()
      message.channel.send(`${tag} Der User wurde gebannt`)
    } else {
      message.channel.send(`${tag} Bitte den User erwähnen`)
    }
  } else {
    message.channel.send(
      `${tag} Du hast nicht die Rechte diesen User zu Bannen.`
    )
  }
})

command(client, 'kick', (message) => {
  const { member, mentions } = message

  const tag = `<@${member.id}>`

  if (
    member.hasPermission('ADMINISTRATOR') ||
    member.hasPermission('KICK_MEMBERS')
  ) {
    const target = mentions.users.first()
    if (target) {
      const targetMember = message.guild.members.cache.get(target.id)
      targetMember.kick()
      message.channel.send(`${tag} Der User wurde gekickt`)
    } else {
      message.channel.send(`${tag} Bitte den User erwähnen.`)
    }
  } else {
    message.channel.send(
      `${tag} Du hast nicht die Rechte diesen User zu kicken.`
    )
  }
})

client.login(config.token)