const Discord = require('discord.js')
const config = require('./config.js')
var SpotifyWebApi = require('spotify-web-api-node')
const client = new Discord.Client()

var spotify = new SpotifyWebApi({
  clientId: 'f5633eb317cf4723b85ae67903cea6b8',
  clientSecret: 'a840ee93598c492880d92942f00e6404'
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`)
})

client.on('message', msg => {
  spotify.clientCredentialsGrant()
  .then(function (data) {
    spotify.setAccessToken(data.body['access_token'])
    if (msg.channel.type !== 'dm' && (config.channel !== msg.channel.id || msg.author.id === client.user.id)) return

    // If message is hello, post hello too
    if (msg.content === 'hello') {
      msg.channel.send('Hello to you too, fellow !')
    }

    // If message begins by !spotifySearch, post the complete answer
    if (msg.content.startsWith('!spotifySearch')) {
      let msgContent = msg.content.trim()
      let msgSplit = msgContent.split(' ')
      let index = msgSplit.indexOf('!spotifySearch')
      let retour = msgSplit.slice(index + 1).join(' ')
      msg.channel.send('Begin of the search...')
      spotify.searchTracks(retour)
      .then(function (data) {
        let numberOfAnswer=0;
        while (numberOfAnswer<3) {
          msg.channel.send("************************")
          msg.channel.send("The answer "+(numberOfAnswer+1)+" is:")
          msg.channel.send("The Artist: " + data.body.tracks.items[numberOfAnswer].artists[0].name + "; The Track: " + data.body.tracks.items[numberOfAnswer].name+ "; The Album: " + data.body.tracks.items[numberOfAnswer].album.name)
          numberOfAnswer++
				}
			}, function (err) {
        console.error(err)
			})
		}

		// If message begins by !spotifyArtists, post the artist's names
    if (msg.content.startsWith('!spotifyArtists')) {
      let msgContent = msg.content.trim()
      let msgSplit = msgContent.split(' ')
      let index = msgSplit.indexOf('!spotifyArtists')
      let retour = msgSplit.slice(index + 1).join(' ')
      msg.channel.send('Begin of the search of artist...')
      spotify.searchTracks(retour)
      .then(function (data) {
        let numberOfAnswer=0;
        while (numberOfAnswer<3){
          msg.channel.send("************************")
          msg.channel.send("The answer "+(numberOfAnswer+1)+" is:")
          msg.channel.send("The Artist: " + data.body.tracks.items[numberOfAnswer].artists[0].name)
          numberOfAnswer++
				}
			}, function (err) {
        console.error(err)
			})
		}

		// If message begins by !spotifyAlbums, post the album's names
    if (msg.content.startsWith('!spotifyAlbums')) {
      let msgContent = msg.content.trim()
      let msgSplit = msgContent.split(' ')
      let index = msgSplit.indexOf('!spotifyAlbums')
      let retour = msgSplit.slice(index + 1).join(' ')
      msg.channel.send('Begin of the search of albums...')
      spotify.searchTracks(retour)
      .then(function (data) {
        let numberOfAnswer=0;
        while (numberOfAnswer<3){
          msg.channel.send("************************")
          msg.channel.send("The answer "+(numberOfAnswer+1)+" is:")
          msg.channel.send("The Album: " + data.body.tracks.items[numberOfAnswer].album.name)
          numberOfAnswer++
				}
			}, function (err) {
        console.error(err)
			})
		}
		// If message begins by !spotifyTracks, post the track's names
    if (msg.content.startsWith('!spotifyTracks')) {
      let msgContent = msg.content.trim()
      let msgSplit = msgContent.split(' ')
      let index = msgSplit.indexOf('!spotifyTracks')
      let retour = msgSplit.slice(index + 1).join(' ')
      msg.channel.send('Begin of the search of tracks...')
      spotify.searchTracks(retour)
      .then(function (data) {
        let numberOfAnswer=0;
        while (numberOfAnswer<3){
          msg.channel.send("************************")
          msg.channel.send("The answer "+(numberOfAnswer+1)+" is:")
          msg.channel.send("The Track: " + data.body.tracks.items[numberOfAnswer].name)
          numberOfAnswer++
				}
			}, function (err) {
        console.error(err)
			})
		}
	})
})

client.login(config.token)
