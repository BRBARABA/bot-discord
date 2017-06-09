const Discord = require('discord.js')
const config = require('./config.js')
const client = new Discord.Client()


client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`)
})

var clientOWM = require('node-rest-client-promise').Client()

client.on('message', msg => {
  // Check if the message has been posted in a channel where the bot operates
  // and that the author is not the bot itself
  if (msg.channel.type !== 'dm' && (config.channel !== msg.channel.id || msg.author.id === client.user.id)) return

  // If message is hello, post hello too
  if (msg.content === 'hello') {
    console.log(' VOILA !')
    msg.channel.send('VOILA')
  }

  var msgTab = msg.content.split(' ')
  console.log("msgTab=" + msgTab)
  if (msgTab[0] === '!weather') { // Si la commande weather est appelée
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
    clientOWM.getPromise('http://api.openweathermap.org/data/2.5/weather?q='+country+','+city+'&units=metric&lang=fr&APPID=28ab43c9ad4db9b92783421704a0e249') // Requête à l'API
      .catch((error) => { // CAS D'ERREUR
        throw error
      })
      .then((res) => { // CODE POUR LE RETOUR
        var weather = 'La température est de ' + res.data.main.temp + '°C' 
        weather = weather + ', l\'humidité est de ' + res.data.main.humidity + ' %'
        weather = weather + ', le temps est : ' + res.data.weather[0].description
        msg.channel.sendMessage(weather)
        console.log(res.data)
      })
  }
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
    clientOWM.getPromise('http://api.openweathermap.org/data/2.5/forecast?q='+country+','+city+'&units=metric&lang=fr&APPID=28ab43c9ad4db9b92783421704a0e249') // Requête à l'API
      .catch((error) => { // CAS D'ERREUR
        throw error
      })
      .then((res) => { // CODE POUR LE RETOUR
        var x = res.data.cnt
        var ecart = x/5
        var k = 1
        for (var j = 1; j <= x; j=j+ecart) { // Boucle pour chaque jour de prévision
          var weather = 'Jour '+k+' : '
          weather = weather + 'La température sera de ' + res.data.list[j].main.temp + '°C'
          weather = weather + ', l\'humidité sera de ' + res.data.list[j].main.humidity + ' %'
          weather = weather + ', le temps sera : ' + res.data.list[j].weather[0].description
          msg.channel.sendMessage(weather)
          k=k+1
          console.log(res.data)
        }
      })
  }
})

client.login(config.token)

