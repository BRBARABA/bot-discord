const Discord = require('discord.js')
const config = require('./config.js')
const client = new Discord.Client()
const twitter = require('./services/twitter.js')
const youtube = require('./services/youtube.js')(config.youtube_apikey)
const owm = require('./services/openweathermap.js')(config.owm_apikey)
const translate = require('./services/translate.js')(config.gtranslate_apikey)
const spotify = require('./services/spotify.js')
const pokeapi = require('./services/pokeapi.js')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`)
  twitter.recup_tweet(send)
})

client.on('message', msg => {
  // Check if the message has been posted in a channel where the bot operates
  // and that the author is not the bot itself
  if ((msg.channel.type !== 'dm' && config.discord_channel !== msg.channel.id) || msg.author.bot || msg.author.id === client.user.id) return

  var data = {}
  data.author = msg.author
  data.channel = msg.channel

  // If message is hello, post hello too
  if (msg.content === 'hello') {
    msg.channel.send('Hello fellow !')
  } else if (msg.content === '!help') {
    var commands = {
      // COMMANDS
      ' ->': 'COMMANDS <- <- ',
      // OPENWEATHERMAP
      '!weather [city]': 'Get the current meteo for city',
      '!forecast [city]': 'Get the next 5 days\' meteo for city',
      // OTHER
      'hello': 'Feel alone ? Answers you another hello',
      // SPOTIFY
      '!spotify [search]': 'Grab something to hear for you',
      '!spotifyArtists [artist to search]': 'Searching for an artist',
      '!spotifyAlbums [album to search]': 'Searching for an album',
      // TRANSLATE
      '!translate [en, fr, ru...] [message]': 'Translate your message into the selected langage',
      // TWITTER
      '!tweet [message]': 'Tweet the message written',
      // YOUTUBE
      '!youtube [name]': 'Retrieves channels, playlists and videos matching name',
      '!youtube !channel [name]': 'Retrieves channels matching name',
      '!youtube !playlist [name]': 'Retrieves playlists matching name',
      '!youtube !video [name]': 'Retrieves videos matching name',
      // AUTOMATICS
      '->': 'AUTOMATICS <- <-',
      'Twitter': 'Retrieves every tweet mentioning ' + config.twitter_tracked
    }
    var usage = 'USAGE :'
    for (var command in commands) {
      usage += '\n' + command + ' -> ' + commands[command]
    }
    answer(usage, data.channel)
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
  } else if (msg.content.startsWith('!tweet ')) {
    data.content = msg.content.substring(7)
    if (data.content.length <= 140 && msg.content.substring(7).length > 0) {
      twitter.post_tweet(data, answer)
    } else {
      answer('Votre message contient plus de 140 caractères !', msg.channel)
    }
  } else if (msg.content.toLowerCase().startsWith('!weather ')) {
    data.content = msg.content.substring(9)
    owm.getWeather(data, answer)
  } else if (msg.content.toLowerCase().startsWith('!forecast ')) {
    data.content = msg.content.substring(10)
    owm.getForecast(data, answer)
  } else if (msg.content.toLowerCase().startsWith('!translate ')) {
    var toTranslate = msg.content.substring(11)
    data.lang = toTranslate.split(' ')[0]
    data.content = toTranslate.substring(data.lang.length + 1)
    translate.translate(data, answer)
  } else if (msg.content.toLowerCase().startsWith('!spotify ')) {
    data.content = msg.content.substring(9)
    spotify.search(data, answer)
  } else if (msg.content.toLowerCase().startsWith('!spotifyartists ')) {
    data.content = msg.content.substring(16)
    spotify.searchArtists(data, answer)
  } else if (msg.content.toLowerCase().startsWith('!spotifyalbums ')) {
    data.content = msg.content.substring(15)
    spotify.searchAlbums(data, answer)
  } else if (msg.content.toLowerCase().startsWith('!pokemon ')) {
    data.content = msg.content.substring(9)
    data.client = client
    pokeapi.transform(data, answer)
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
