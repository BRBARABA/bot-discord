var clientOWM = require('node-rest-client-promise').Client()
var api = 'http://api.openweathermap.org/data/2.5/'

module.exports = function (apikey) {
  var module = {}
  module.apikey = apikey

  module.getWeather = function (city, callback) {
    clientOWM.getPromise(api + 'weather?q=' + city + '&units=metric&lang=fr&APPID=' + module.apikey) // Requête à l'API
    .catch((error) => { // CAS D'ERREUR
      throw error
    })
    .then((res) => { // CODE POUR LE RETOUR
      var weather = 'La température est de ' + res.data.main.temp + '°C,\nL\'humidité est de ' + res.data.main.humidity + ' %,\nle temps est : ' + res.data.weather[0].description
      if (callback) {
        callback(weather)
      }
    })
  }

  module.getForecast = function (city, callback) {
    clientOWM.getPromise('http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=metric&lang=fr&APPID=' + module.apikey) // Requête à l'API
    .catch((error) => { // CAS D'ERREUR
      throw error
    })
    .then((res) => { // CODE POUR LE RETOUR
      var x = res.data.cnt
      var ecart = x / 5
      var k = 1
      var weather = ''

      for (var j = 1; j <= x; j = j + ecart) { // Boucle pour chaque jour de prévision
        if (j > 1) {
          weather += '\n'
        }
        weather += 'Jour ' + k + ' :\n'
        weather += '\tLa température sera de ' + res.data.list[j].main.temp + '°C,\n\tl\'humidité sera de ' + res.data.list[j].main.humidity + ' %,\n\tle temps sera : ' + res.data.list[j].weather[0].description
        k = k + 1
      }
      if (callback) {
        callback(weather)
      }
    })
  }

  return module
}
