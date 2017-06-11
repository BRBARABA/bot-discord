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

  return module
}

/*
if (msgTab[0] === '!forecast') { // Si la commande forecast est appelée
  var messageOWM = '' // On initialise la variable paramètre
  for (var j = 1; j < msgTab.length; j++) { // Boucle pour chaque paramètre (ville, pays...)
    messageOWM = messageOWM + ' ' + msgTab[j] // La variable regroupe l'ensemble des paramètres
  }
  var newMessageOWM = messageOWM.split(', ') // Découpe de la variable
  var city = newMessageOWM[0] // La ville est la première variable
  var country = newMessageOWM[1] // Le pays est la seconde variable
  console.log(messageOWM)
  console.log(city)
  console.log(country)
  clientOWM.getPromise('http://api.openweathermap.org/data/2.5/forecast?q=' + country + ',' + city + '&units=metric&lang=fr&APPID=28ab43c9ad4db9b92783421704a0e249') // Requête à l'API
  .catch((error) => { // CAS D'ERREUR
  throw error
})
.then((res) => { // CODE POUR LE RETOUR
  var x = res.data.cnt
  var ecart = x / 5
  var k = 1
  for (var j = 1; j <= x; j = j + ecart) { // Boucle pour chaque jour de prévision
    var weather = 'Jour ' + k + ' : '
    weather = weather + 'La température sera de ' + res.data.list[j].main.temp + '°C'
    weather = weather + ', l\'humidité sera de ' + res.data.list[j].main.humidity + ' %'
    weather = weather + ', le temps sera : ' + res.data.list[j].weather[0].description
    msg.channel.sendMessage(weather)
    k = k + 1
    console.log(res.data)
  }
})
} */
