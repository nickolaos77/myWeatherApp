'use strict'
const express      = require('express'),
      app          = express(),
      http         = require('http').Server(app),
      request      = require('request'),
      headparser   = require('./headparser.js'),
      urlstartW    = 'http://api.openweathermap.org/data/2.5/weather?',
      urlstartF    = 'http://api.openweathermap.org/data/2.5/forecast/daily?',
      apiID        = process.env.OpenWeatherKey ||,
    //io           = require('socket.io')(http),
      PORT         = process.env.PORT || 3000; 

function getDay(unixtime){
    let date = new Date(unixtime*1000);
    return date.toString().split(' ')[0];
}

function forecastDays(elem){  
    let dayWeather = {
        date        : getDay(elem.dt),
        minTemp     : (Number(elem.temp.min) - 273.15).toFixed(0),
        maxTemp     : (Number(elem.temp.max) - 273.15).toFixed(0),
        description : elem.weather[0].main,
        iconUrl     : '/images/' + elem.weather[0].main + '.svg'
    }
    return dayWeather
}

function getWeather(res,query){
        request(urlstartF + query +'&cnt=6&APPID=' + apiID , function (error, response, body) {
            if (error) console.log('Error in forecast weather')
            else if (!error && response.statusCode == 200) {
                let bodyObj    = JSON.parse(body)
                let cityCountry= bodyObj.city.name +','+ bodyObj.city.country 
                let forecast   = [cityCountry]
                bodyObj.list.forEach(function(elem){
                    forecast.push( forecastDays(elem) )
                })
                let fivedays = forecast.slice(2,7)
            res.render('weather',{
                "cityName"  :forecast[0],
                "mainImage" :forecast[1].iconUrl,
                "todayMax"  :forecast[1].maxTemp,
                "todayMin"  :forecast[1].minTemp,
                "fivedays"  :fivedays
            })
            }
        })
}
  //res.render('home',{"stocks":stocksGlobal, "prices" : JSON.stringify(addRowsArrayGlobal)});
const handlebars      = require('express-handlebars').create({
        defaultLayout: 'main',
        helpers:{
            section:function(name,options){
                if(!this._sections) this._sections ={}
                this._sections[name] = options.fn(this)
                return null
            }
        }
    })

app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')
app.use(express.static(__dirname+ '/public'))

app.get('/', function(req, res){
    headparser(req)
    res.render('home')
})

app.get('/:city', function(req, res){
    let query = 'q=' + req.params.city
    getWeather(res,query)
})

app.get('/locate/:lat/:lon', function(req, res){
    let query = 'lat=' + req.params.lat + '&lon=' + req.params.lon
    getWeather(res,query)
})

http.listen(PORT, function(){
    console.log('Express listening on port '+ PORT + '!')
})