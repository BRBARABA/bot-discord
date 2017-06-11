module.exports = function (apikey) {
  var googleTranslate = require('google-translate')(apikey)
  var module = {}
  module.apikey = apikey

  module.translate = function (data, callback) {
    googleTranslate.translate(data.content, data.lang, function (err, translation) { // FONCTION DU TRADUCTION GOOGLE
      if (err) {
        console.log('Error', err)
      }
      var reponse = ''
      if (typeof translation === 'undefined') { // SI LE CODE LANGUE N'EST PAS COMPRIS
        reponse = 'Langue non supportée' // RENVOI UN MESSAGE D'ERREUR
      } else {
        reponse = translation.translatedText // POSTE LE MESSAGE TRADUIT
      }
      if (callback) {
        callback(reponse, data.channel)
      }
    })
  }

  return module
}
