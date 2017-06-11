var client = require('node-rest-client-promise').Client()
var api = 'https://www.googleapis.com/youtube/v3/'

function encodeQuery (url, data) {
  url += '?'
  for (var param in data) {
    url += param + '=' + data[param] + '&'
  }
  return url
}

module.exports = function (apikey) {
  var module = {}
  module.apikey = apikey

  module.search = function (data, callback) {
    var params = {'maxResults': '3',
      'q': data.content,
      'part': 'snippet',
      'type': '',
      'key': module.apikey}
    if (data.hasOwnProperty('type')) {
      params.type = data.type
    }

    var query = encodeQuery(api + 'search', params)
    client.getPromise(query)
    .catch((error) => {
      throw error
    })
    .then((res) => {
      var content = ''

      if (res.response.statusCode === 200) {
        content += data.author + ', voici les résultats pour : ' + data.content + '\n\n'
        if (res.data.items.length === 0) {
          content += 'Beeh il n\'y en a pas :/'
        } else {
          for (var obj of res.data.items) {
            if (obj.id.kind === 'youtube#channel') {
              content += '-> Chaine de ' + obj.snippet.title + ' : https://www.youtube.com/channel/' + obj.id.channelId
            } else if (obj.id.kind === 'youtube#video') {
              content += '-> ' + obj.snippet.title + ' : https://www.youtube.com/watch?v=' + obj.id.videoId
            } else if (obj.id.kind === 'youtube#playlist') {
              content += '-> ' + obj.snippet.title + ' : https://www.youtube.com/playlist?list=' + obj.id.playlistId
            }
            content += '\n'
          }
        }
      } else if (res.response.statusCode === 400) {
        content += 'Désolé ' + data.author + ' mais je ne trouve pas ' + data.content + ' :('
      }

      if (callback) {
        callback(content, data.channel)
      }
    })
  }

  return module
}
