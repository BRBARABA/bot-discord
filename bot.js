const Discord = require('discord.js')
const config = require('./config.js')
const client = new Discord.Client()
const owm = require('./services/openweathermap.js')(config.owm_apikey)

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`)
})

client.on('message', msg => {
  // Check if the message has been posted in a channel where the bot operates
  // and that the author is not the bot itself
  if ((msg.channel.type !== 'dm' && config.discord_channel !== msg.channel.id) || msg.author.id === client.user.id) return

  // If message is hello, post hello too
  if (msg.content === 'hello') {
    msg.channel.send('Hello fellow !')
  }
  if (msg.content.toLowerCase().startsWith('!weather ')) {
    owm.getWeather(msg.content.split(9), send)
  }
})

function answer (content, channel) {
  channel.send(content)
}

function send (content) {
  var channelID = config.discord_channel
  for (var channel of client.channels) {
    if (channel[0] === channelID) {
      answer(content, channel[1])
      return
    }
  }
}

client.login(config.discord_token)
