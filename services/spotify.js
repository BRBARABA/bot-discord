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
  search: function (data, callback) {
    spotify.searchTracks(data.content)
    .then(function (response) {
      var message = ''
      let i = 0
      var tracks = response.body.tracks.items
      if (!tracks || tracks.length === 0) {
        message += 'Didn\'t find any result. Listen better music !'
      }
      while (i < 3 && i < tracks.length) {
        if (i > 0) {
          message += '\n'
        }
        message += tracks[i].name + ' : '
        message += '\n\tArtist: ' + tracks[i].artists[0].name + ';\n\tAlbum: ' + tracks[i].album.name
        var trackUrl = 'https://play.spotify.com/track/' + tracks[i].id
        message += '\n\t' + trackUrl
        i++
      }
      if (callback) {
        callback(message, data.channel)
      }
    }, function (err) {
      console.error(err)
    })
  },
  searchArtists: function (data, callback) {
    spotify.searchArtists(data.content)
    .then(function (response) {
      var message = ''
      let i = 0
      var artists = response.body.artists.items
      if (!artists || artists.length === 0) {
        message += 'Didn\'t find any result. Listen better music !'
      }
      while (i < 3 && i < artists.length) {
        if (i > 0) {
          message += '\n'
        }
        message += artists[i].name + ' : '
        message += '\n\tArtist: ' + artists[i].name
        var trackUrl = 'https://play.spotify.com/artist/' + artists[i].id
        message += '\n\t' + trackUrl
        i++
      }
      if (callback) {
        callback(message, data.channel)
      }
    }, function (err) {
      console.error(err)
    })
  },
  searchAlbums: function (data, callback) {
    spotify.searchAlbums(data.content)
    .then(function (response) {
      var message = ''
      let i = 0
      var albums = response.body.albums.items
      if (!albums || albums.length === 0) {
        message += 'Didn\'t find any result. Listen better music !'
      }
      while (i < 3 && albums.length) {
        if (i > 0) {
          message += '\n'
        }
        message += albums[i].name + ' : '
        message += '\n\tAlbums: ' + albums[i].name
        var trackUrl = 'https://play.spotify.com/album/' + albums[i].id
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
