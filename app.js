
 const request = require('request')
//  const geocode = require('./utils/geocode')
//  const forecast = require('./utils/forecast')


const geocodeRequest = (address, callback) => {

    const placesUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + address + ' .json?access_token=pk.eyJ1IjoidGdhcmFzYW5pbiIsImEiOiJja2EzemRlcnQwOTJmM25vNnF2OW9ybnJqIn0._vLeviNihUXsStqhtRg76w&limit=1'

    request({url: placesUrl, json: true}, (error, response) => {
       // console.log(response.body.features[0].place_name)
       if (error) {
           callback('Unable to connect to location services!', undefined)
       } else if (response.body.features.lenght === 0) {
           callback('Unable to find location. Try another search.', undefined)
       }  else {
           const latitude = response.body.features[0].geometry.coordinates[0]
           const longitude = response.body.features[0].geometry.coordinates[1]
           callback(undefined, {'latitude':latitude, 'longitude': longitude})
       }
   
    })

}

const weatherRequest = (longitude, latitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=c170e4c2aedb26797115be7ba5a95061&query=' + longitude + ',' + latitude

    request({ url: url, json: true}, (error, response) => {
       if (error) {
           callback('Unable to connect to weather service', undefined)
       } else if (response.body.error) {
           callback('Unable to connect to weather service!', undefined)
       } else {
           callback(undefined, {
               'desc': response.body.current.weather_descriptions[0],
               'temp': response.body.current.temperature,
               'precip': response.body.current.precip 
           })
       }
   
    })
}


geocodeRequest('Belgrade', (error, data) => {
    if (error) {
        console.log(error)
    } else {
        weatherRequest(data.longitude, data.latitude, (error, response) => {
           console.log(response.desc + '. It is currently ' + response.temp + ' degress out. There is a ' + response.precip + ' % chance of rain')
        })
    }
})