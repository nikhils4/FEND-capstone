// configuring env
const dotenv = require('dotenv');
dotenv.config();

// importing modules
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const axios = require('axios');
const path = require('path');
// To remove regeneratorRuntime error while testing
require('babel-polyfill');

// setting middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('dist'));
app.use(bodyParser.urlencoded({extended: true,}));

// home route
app.get('/', function(req, res) {
  res.sendFile(path.resolve('dist/index.html'))
})

// server test route
app.get('/test', function(req, res) {
  res.json({
    status : 200
  })
})

// using geoname API to fetch lat and lang coordinate
app.get('/getLatLang', (req, res) => {
  const url = `http://api.geonames.org/searchJSON?maxRows=10&operator=OR&q=${req.query.city}&name=${req.query.city}&username=${process.env.USERNAME}`;
  axios.get(url).then(resp => {
    res.end(JSON.stringify(resp.data.geonames[0]));
  })
  .catch(err => {
    res.end(JSON.stringify({err : "There was some error"}));
  })
})

// using weatherbit API to get the weather details of the place 
app.get('/getWeather', (req, res) => {
  const url = `https://api.weatherbit.io/v2.0/current?lat=${req.query.lat}&lon=${req.query.long}&key=${process.env.WEATHER_KEY}`;
  axios.get(url).then(resp => {
    res.end(JSON.stringify(resp.data));
  })
  .catch(err => {
    res.end(JSON.stringify({err : "There was some error"}));
  })
})

// using pixabay API to get image related to trip
app.get('/getPics', (req, res) => {
  const url = `https://pixabay.com/api/?key=${process.env.PIXABAY_KEY}&q=${req.query.q}&image_type=photo`;
  axios.get(url).then(resp => {
    res.end(JSON.stringify(resp.data.hits[0]));
  })
  .catch(err => {
    res.end(JSON.stringify({err : "There was some error"}));
  })
})

// to set the server up at the defined port
app.listen(8081, () => {
  console.log('Server up on port 8081');
});


module.exports = app;