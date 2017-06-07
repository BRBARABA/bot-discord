var Twitter = require('twitter')
var config = require('../config.js')

var client = new Twitter({
  consumer_key: config.twitter_consumer_key,
  consumer_secret: config.twitter_consumer_secret,
  access_token_key: config.twitter_access_token_key,
  access_token_secret: config.twitter_access_token_secret
})

module.exports = {
  post_tweet: function (data, callback) {
    var params = {status: data.text}
    client.post('statuses/update', params, function (error, tweets, response) {
      console.log(tweets)
      var message = ''
      if (!error) {
        console.log(tweets)
        message = 'J\'ai tweeté !'
      } else {
        message = 'Je n\'ai pas réussi à tweeter'
      }
      if (callback) {
        callback(message, data.channel)
      }
    })
  },

  recup_tweet: function (callback) {
    client.stream('statuses/filter', {track: 'MusgaFR'}, function (stream) {
      stream.on('data', function (tweet) {
        if (callback) {
          var message = 'http://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str
          callback(message)
        }
      })

      stream.on('error', function (error) {
        console.log('Twitter stream error : ', error)
        // throw error
      })
    })
  }
}
