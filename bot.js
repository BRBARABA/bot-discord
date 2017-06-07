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
  } else if (msg.content.startsWith('!youtube ')) {
    var possibilities = ['channel', 'video', 'playlist']
    data.content = msg.content.split('!youtube ')[1]

    for (var i = 0; i < possibilities.length; i++) {
      if (data.content.startsWith('!' + possibilities[i] + ' ')) {
        data.content = data.content.split('!' + possibilities[i] + ' ')[1]
        data.type = possibilities[i]
        break
      }
    }
    youtube.search(data, answer)
  }
})

client.login(config.token)

function answer (content, channel) {
  channel.send(content)
}
