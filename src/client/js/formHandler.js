// To remove regeneratorRuntime error while testing
import 'babel-polyfill';

// will be storing all the UI related data
let UIdata = {};

// get the length of the trip
const getLengthOfTrip = () => {
  const start = new Date(document.getElementById('start').value);
  const end = new Date(document.getElementById('end').value);
  const length = end.getTime() - start.getTime();
  UIdata.lengthOfTrip = length / (1000 * 60 * 60 * 24) + " days";
}

// get the number of days remaing for the trip
const getRemainingDaysOfTrip = () => {
  const start = new Date(document.getElementById('start').value);
  const time = new Date();
  const remainingTimeToTrip = Math.ceil(start - time);
  UIdata.remainingTimeToTrip = Math.ceil(remainingTimeToTrip / (1000 * 60 * 60 * 24)) + " days";
}

// to handle the stuff realted to form input
async function formHandler() {
  const city = document.getElementById('destination').value;
  // getting the lat and lang for the input city value
  await fetch(`http://localhost:8081/getLatLang?city=${city}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
  .then(res => res.json()) 
  .then(async res => {
    UIdata.country = res.countryName;
    UIdata.city = res.name;
    UIdata.population = res.population;
    await getWeather(`http://localhost:8081/getWeather?lat=${res.lat}&long=${res.lng}`)
  })
  .catch(err => {
    console.log(err)
  })
}

// to get weather using the lat and lang values
const getWeather = async (url) => {
  await fetch(url , {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
  .then(res => res.json()) 
  .then(async res => {
    UIdata.temperature = res.data[0].temp;
    UIdata.weatherDesc = res.data[0].weather.description;
    await getPics(`http://localhost:8081/getPics?q=${UIdata.city}`)
  })
  .catch(err => {
    console.log(err)
  })
}

// to get the pics related to city name entered
const getPics = async (url) => {
  await fetch(url , {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
  .then(res => res.json()) 
  .then(res => {
    UIdata.img = res.webformatURL;
  })
  .catch(err => {
    console.log(err)
  })
}

// to validate the form values and process accordingly 
export const validateAndProcess = async () => {
  const destination = document.getElementById('destination').value;
  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;
  const startDate = new Date(start);
  const endDate = new Date(end);

  if(start.length !== 0 && end.length !== 0 && destination.length !== 0 && (endDate - startDate >= 0)){
    document.getElementById('form-submit').innerHTML = "Fetching data..."
    await formHandler();
    getRemainingDaysOfTrip();
    getLengthOfTrip();
    document.getElementById('form-submit').innerHTML = "Submit";
    updateUI();
  } else {
    document.getElementById('status').innerHTML = "Please enter correct values";
    setTimeout(() => {
      document.getElementById('status').innerHTML = "";
    }, 2500)
  }
}

// to populate the UI with the data
export const updateUI = () => {
  document.getElementById('modal-img').setAttribute('src', UIdata.img);
  document.getElementById('modal-city').innerHTML = UIdata.city;
  document.getElementById('modal-country').innerHTML = UIdata.country;
  document.getElementById('modal-temp').innerHTML = UIdata.temperature;
  document.getElementById('modal-weather').innerHTML = UIdata.weatherDesc;
  document.getElementById('modal-population').innerHTML = UIdata.population;
  document.getElementById('modal-timeRemaining').innerHTML = UIdata.remainingTimeToTrip;
  document.getElementById('modal-tripLength').innerHTML = UIdata.lengthOfTrip;
  document.getElementById('modal-launch').click();
}
