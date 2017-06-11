import test from 'ava'
var client = require('node-rest-client-promise').Client()
var config = require('../config.js')
var googleTranslate = require('google-translate')(config.gtranslate_apikey)

test('OpenWeatherMap_API', t => {
  return client.getPromise('http://api.openweathermap.org/data/2.5/weather?q=London&APPID=' + config.owm_apikey)
    .catch((error) => {
      t.fail()
      throw error
    })
    .then((res) => {
      console.log(res.response.statusCode)
      t.is(res.response.statusCode, 200)
    })
})

test('Youtube_API', t => {
  return client.getPromise('https://www.googleapis.com/youtube/v3/search?maxResults=3&q=MusgaFR&part=snippet&key=' + config.youtube_apikey)
    .catch((error) => {
      t.fail()
      throw error
    })
    .then((res) => {
      console.log(res.response.statusCode)
      t.is(res.response.statusCode, 200)
    })
})

test('Translate', t => {
  googleTranslate.translate('Coucou', 'en', function (err, translation) {
    if (err) {
      t.fail()
      throw err
    }
    if (typeof translation === 'undefined') {
      t.fail()
    } else {
      t.is(translation.detectedSourceLanguage, 'fr')
    }
  })
})
