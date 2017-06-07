const Discord = require('discord.js')
const config = require('./config.js')
const twitter = require('./services/twitter.js')
const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`)
  twitter.recup_tweet(send)
})

client.on('message', msg => {
  // Check if the message has been posted in a channel where the bot operates
  // and that the author is not the bot itself
  if (msg.channel.type !== 'dm' && (config.channel !== msg.channel.id || msg.author.id === client.user.id)) return

  // If message is hello, post hello too
  if (msg.content === 'hello') {
    msg.channel.sendMessage('Hello to you too, fellow !')
  }

  if (msg.content.substring(0, 7) === '!tweet ') {
    if (msg.content.substring(7).length <= 140 && msg.content.substring(7).length > 0) {
      twitter.post_tweet({text: msg.content.substring(7), channel: msg.channel}, answer)
    } else {
      return msg.channel.sendMessage('Votre message contient plus de 140 caractères !')
    }
  }
})

function answer (content, channel) {
  channel.send(content)
}

function send (content) {
  var channelID = config.channel
  for (var channel of client.channels) {
    if (channel[0] === channelID) {
      channel[1].send(content)
      return
    }
  }
}

client.login(config.token)
