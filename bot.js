const Discord = require('discord.js')
const config = require('./config.js')
const client = new Discord.Client()
const youtube = require('./services/youtube.js')(config.youtube_apikey)

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`)
})

client.on('message', msg => {
  // Check if the message has been posted in a channel where the bot operates
  // and that the author is not the bot itself
  if ((msg.channel.type !== 'dm' && config.channel !== msg.channel.id) || msg.author.id === client.user.id) return

  var data = {}
  data.author = msg.author
  data.channel = msg.channel

  // If message is hello, post hello too
  if (msg.content.toLowerCase() === 'hello') {
    msg.channel.send('hello')
  } else if (msg.content.substr(0, 9).toLowerCase() === '!youtube ') {
    youtube.search({content: msg.content.substr(9)}, data, answer)
  } else if (msg.content.substr(0, 16).toLowerCase() === '!channelyoutube ') {
    youtube.search({content: msg.content.substr(16), type: 'channel'}, data, answer)
  } else if (msg.content.substr(0, 14).toLowerCase() === '!videoyoutube ') {
    youtube.search({content: msg.content.substr(14), type: 'video'}, data, answer)
  } else if (msg.content.substr(0, 17).toLowerCase() === '!playlistyoutube ') {
    youtube.search({content: msg.content.substr(17), type: 'playlist'}, data, answer)
  }
})

client.login(config.token)

function answer (content, channel) {
  channel.send(content)
}
