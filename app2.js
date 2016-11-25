'use strict'
const express      = require('express'),
      app          = express(),
      http         = require('http').Server(app),
      request      = require('request'),
      urlstartW    = 'http://api.openweathermap.org/data/2.5/weather?',
      urlstartF    = 'http://api.openweathermap.org/data/2.5/forecast/daily?',
      apiID        = 'e2b730cc523936d1dc01e11605302b22',
    //io           = require('socket.io')(http),
      PORT         = process.env.PORT || 3000;    


function getDay(unixtime){
    let date = new Date(unixtime*1000);
    return date.toString().split(' ')[0];
}

function aDay(elem){  
    let dayWeather = {
        cityCountry : elem.name + ',' + elem.sys.country,
        date        : getDay(elem.dt),
        minTemp     : (Number(elem.main.temp_min) - 273.15).toFixed(0),
        maxTemp     : (Number(elem.main.temp_max) - 273.15).toFixed(0),
        description : elem.weather[0].main,
        iconUrl     : 'images/' + elem.weather[0].main + '.svg'
    }
    return dayWeather
}


function forecastDays(elem){  
    let dayWeather = {
        date        : getDay(elem.dt),
        minTemp     : (Number(elem.temp.min) - 273.15).toFixed(0),
        maxTemp     : (Number(elem.temp.max) - 273.15).toFixed(0),
        description : elem.weather[0].main,
        iconUrl     : 'images/' + elem.weather[0].main + '.svg'
    }
    return dayWeather
}

var currentWeather = function (res,query){
    return new Promise (function (resolve,reject){
        request(urlstartW + query + '&APPID=' + apiID , function (error, response, body) {
            if (error) reject('Error in current weather')
            else if (!error && response.statusCode == 200) {
                let todaysWeather = aDay(JSON.parse(body))
                resolve(todaysWeather)
            }
        })
    })}

var forecastWeather = function (res, query){
    return new Promise (function (resolve,reject){
        request(urlstartF + query +'&cnt=6&APPID=' + apiID , function (error, response, body) {
            if (error) reject('Error in forecast weather')
            else if (!error && response.statusCode == 200) {
                let bodyObj    = JSON.parse(body)
                let forecast   = []
                bodyObj.list.forEach(function(elem){
                    forecast.push( forecastDays(elem) )
                })
            resolve(forecast)
            }
        })
    })}

function getAllWeather(res,query){
    
    Promise.all([currentWeather(res,query),forecastWeather(res,query)]).then(function(forecasts){
        res.send(forecasts)
    }).catch(function(reason){console.log(reason)})  
}

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
    res.render('home')
})

app.get('/test', function(req, res){
    res.render('weather')
})

app.get('/:city', function(req, res){
    let query = 'q=' + req.params.city
    getAllWeather(res,query)
})

app.get('/locate/:lat/:lon', function(req, res){
    let query = 'lat=' + req.params.lat + '&lon=' + req.params.lon
    getAllWeather(res,query)
})

http.listen(PORT, function(){
    console.log('Express listening on port '+ PORT + '!')
})