var SpotifyWebApi = require('spotify-web-api-node')
var config = require('../config.js')

var spotify = new SpotifyWebApi({
  clientId: config.spotify_clientId,
  clientSecret: config.spotify_clientSecret
})
spotify.clientCredentialsGrant()
.then(function (data) {
  spotify.setAccessToken(data.body['access_token'])
})

module.exports = {
  searchTracks: function (data, callback) {
    spotify.searchTracks(data.content)
    .then(function (response) {
      var message = ''
      let i = 0
      var tracks = response.body.tracks.items
      while (i < 3) {
        if (i > 0) {
          message += '\n'
        }
        message += tracks[i].name + ' : '
        message += '\n\tArtist: ' + tracks[i].artists[0].name + ';\n\tAlbum: ' + tracks[i].album.name
        var trackUrl = 'https://play.spotify.com/track/' + tracks[i].href.split('/').pop()
        message += '\n\t' + trackUrl
        i++
      }
      if (callback) {
        callback(message, data.channel)
      }
    }, function (err) {
      console.error(err)
    })
  }
}

/*

  // If message begins by !spotifyArtists, post the artist's names
  if (msg.content.startsWith('!spotifyArtists')) {
    let msgContent = msg.content.trim()
    let msgSplit = msgContent.split(' ')
    let index = msgSplit.indexOf('!spotifyArtists')
    let retour = msgSplit.slice(index + 1).join(' ')
    msg.channel.send('Begin of the search of artist...')
    spotify.searchTracks(retour)
    .then(function (data) {
      let numberOfAnswer = 0
      while (numberOfAnswer < 3) {
        msg.channel.send('************************')
        msg.channel.send('The answer ' + numberOfAnswer + ' is:')
        msg.channel.send('The Artist: ' + data.body.tracks.items[numberOfAnswer].artists[0].name)
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
      let i = 0
      while (i < 3) {
        let numberOfAnswer = i + 1
        msg.channel.send('************************')
        msg.channel.send('The answer ' + numberOfAnswer + ' is:')
        msg.channel.send('The Album: ' + data.body.tracks.items[i].album.name)
        i++
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
      let i = 0
      while (i < 3) {
        let numberOfAnswer = i + 1
        msg.channel.send('************************')
        msg.channel.send('The answer ' + numberOfAnswer + ' is:')
        msg.channel.send('The Track: ' + data.body.tracks.items[i].name)
        i++
      }
    }, function (err) {
      console.error(err)
    })
  }
})
*/
