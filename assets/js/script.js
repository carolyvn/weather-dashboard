let cities = [];

let cityInput = document.querySelector("#cityname");
let searchBtn = document.querySelector("#searchBtn");
let searchHistory = document.querySelector("#search-history")

let currentDiv = document.querySelector("#current-forecast");
let futureDiv = document.querySelector("#future-forecast");

const APIKey = '6dfce695e145bfd386b9347a971d18ee';
let cityname = "Shoreline";
let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&units=imperail" + "&appid=" + APIKey;

function getWeather () {
    fetch(queryURL)
      .then( function(response) {
        return response.json();
    })
      .then(function (data) {
        console.log(data);
        displayData(data);
    });
};


function displayData(data, searchCity) {
    
    currentDiv.innerHTML = '';
    futureDiv.innerHTML = '';
    cityInput.textContent = searchCity;
    console.log(searchCity);

    let currentForecast = data.list[0];

    // create html element for currentDiv
    let currentCard = document.createElement('div');
    let h2 = document.createElement("h2")
    let currentDate = moment(data.dt).format("MM/DD/YYYY");
    // let currentTime = 2;
    let forecastIcon = document.createElement("img");
    let temp = document.createElement("p");
    let humidity = document.createElement("p");
    let windspeed = document.createElement("p");
    let uvIndex = document.createElement("p");

    h2.textContent = `${cityname} (${currentDate})`;
    temp.textContent = "Temperature: " + ((currentForecast.main.temp - 273.15) * (9/5) + 32).toFixed(0) + "°F";
    humidity.textContent = "Humidity: " + currentForecast.main.humidity + "%";
    windspeed.textContent = "Windspeed: " + currentForecast.wind.speed + " mph";
    forecastIcon.setAttribute('src', `https://openweathermap.org/img/wn/${currentForecast.weather[0].icon}@2x.png`);
    console.log(h2.textContent, temp.textContent, humidity.textContent, windspeed.textContent);

    // let currentTime = moment(data.dt).toDate().getTime();
    let lat = data.city.coord.lat;
    let lon = data.city.coord.lon;
    console.log(lat, lon);
    // let uvUrl = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${currentTime}&appid=${APIKey}`;
    // let uvURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
    let oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}`;
  

    fetch(oneCallUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        uvIndex.textContent = "UV Index: " + data.current.uvi;
        console.log(uvIndex); 

        if (data.current.uvi <= 2) {
          uvIndex.classList = "favorable";
          console.log('favorable');
        } else if (data.current.uvi > 2 && data.current.uvi <= 8) {
          uvIndex.classList = "moderate";
          console.log('moderate');
        } else if (data.current.uvi > 8) {
          uvIndex.classList = "severe";
          console.log('severe');
        }
        
      })

    
    // append element to card 
    currentCard.appendChild(h2);
    currentCard.appendChild(forecastIcon);
    currentCard.appendChild(temp);
    currentCard.appendChild(humidity);
    currentCard.appendChild(windspeed);
    currentCard.appendChild(uvIndex);

    // append card to currentDiv
    currentDiv.appendChild(currentCard);

    //futureDiv
    let heading = document.createElement('h2');
    let card = document.createElement('div');
    // let cardBody = document.createElement('div');

    heading.textContent = "5-Day Forecast:";
    heading.classList = 'mb-3';

    futureDiv.appendChild(heading);
    futureDiv.appendChild(card);



    let forecast = data.list;
    for (let i = 5; i < forecast.length; i = i + 8) {
        let dailyForecast = forecast[i];

        let h4 = document.createElement("h4");
        let weatherIcon = document.createElement('img');
        let futureTemp = document.createElement("p");
        let futureHumidity = document.createElement("p");

        card.classList = 'col-3 bg-primary text-white m-1 text-center'
        h4.classList = 'card-header';
        weatherIcon.classList = 'card-body';
        futureTemp.classList = 'card-body';
        futureHumidity.classList = 'card-body';

        h4.textContent = moment.unix(dailyForecast.dt).format('MMM D, YYYY');
        futureTemp.textContent = "Temperature: "+ ((dailyForecast.main.temp - 273.15) * (9/5) + 32).toFixed(0) + "°F";
        futureHumidity.textContent = "Humidy: " + dailyForecast.wind.speed + " mph";
        weatherIcon.setAttribute('src', `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}.png`);

        card.appendChild(h4);
        card.appendChild(weatherIcon);
        card.appendChild(futureTemp);
        card.appendChild(futureHumidity);
    };
};

searchBtn.addEventListener("click", getWeather());
