require('promise')
var request = require('request')
var api = 'http://pokeapi.co/api/v2/'

function getPokemon (pokemon) {
  return new Promise(function (resolve, reject) {
    request.get(api + 'pokemon/' + pokemon, function (error, response, body) {
      if (error) {
        console.log('ERROR : ', error)
        reject(error)
        return
      }
      resolve(JSON.parse(body))
    })
  })
}

function setUsername (client, newName) {
  return new Promise(function (resolve, reject) {
    client.setUsername(newName)
    .then(function () {
      console.log(newName)
      resolve(true)
    })
    .catch(console.error)
  })
}

function setAvatar (client, avatarUrl) {
  return new Promise(function (resolve, reject) {
    client.setAvatar(avatarUrl)
    .then(resolve(true))
    .catch(console.error)
  })
}

/*
function getEvolution () {
  return new Promise(function (resolve, reject) {

  })
}
*/

module.exports = {
  transform: function (data, callback) {
    getPokemon(data.content).then(function (content) {
      var response = ''

      if (content.detail === 'Not found.') {
        response = 'Tu as inventé un nouveau pokémon, va vite voir le Prof. Chen pour compléter son Pokédex !'
        if (callback) {
          callback(response, data.channel)
        }
      } else {
        response = 'Pokédex {voix enervante} :\n\t' + content.name + ' pokémon ' + content.types[0].type.name + ', pèse ' + content.weight + 'pounds et fait généralement ' + content.height + 'feets.'
        setAvatar(data.client.user, content.sprites.front_default).then(function (status) {
          setUsername(data.client.user, content.name).then(function (status) {
            if (callback) {
              callback(response, data.channel)
            }
          })
        })
      }
    }).catch(function (err) {
      console.error(err)
      var response = 'Erreur : ' + err
      if (callback) {
        callback(response, data.channel)
      }
    })
  },

  evolve: function (data) {
    return new Promise(function (resolve, reject) {

    })
  }
}
