let cities = [];

let searchForm = document.querySelector("#search-form");
let cityInput = document.querySelector("#cityname");
let searchBtn = document.querySelector("#searchBtn");
let searchHistory = document.querySelector("#search-history");
let clearBtn = document.querySelector("#clearBtn");

let currentDiv = document.querySelector("#current-forecast");
let futureDiv = document.querySelector("#future-forecast");

const APIKey = "6dfce695e145bfd386b9347a971d18ee";
let cityname = "Shoreline";
let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&units=imperail" + "&appid=" + APIKey;

function getWeather() {
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      displayData(data);
    });
};


function displayData(data) {

  currentDiv.innerHTML = "";
  futureDiv.innerHTML = "";

  // get lat and lon of city
  let lat = data.city.coord.lat;
  let lon = data.city.coord.lon;
  console.log(lat, lon);

  let oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}`;

  fetch(oneCallUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      let current = data.current;
      console.log(current);

      // create html element for currentDiv
      let currentCard = document.createElement("div");
      let h2 = document.createElement("h2")
      let currentDate = moment.unix(current.dt).format("MM/DD/YYYY");
      let forecastIcon = document.createElement("img");
      let temp = document.createElement("p");
      let humidity = document.createElement("p");
      let windspeed = document.createElement("p");
      let uvIndexEl = document.createElement("p");
      let uvIndex = document.createElement("span");


      // console.log(current.temp, current.humidity, current.uvi, current.wind_speed);

      h2.textContent = `${cityname} (${currentDate})`;
      temp.textContent = "Temperature: " + ((current.temp - 273.15) * (9 / 5) + 32).toFixed(0) + "°F";
      humidity.textContent = "Humidity: " + current.humidity + "%";
      windspeed.textContent = "Windspeed: " + current.wind_speed + " mph";
      forecastIcon.setAttribute("src", `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`);
      uvIndexEl.textContent = "UV Index: "
      uvIndex.textContent = current.uvi;

      console.log(h2.textContent, temp.textContent, humidity.textContent, windspeed.textContent);

      if (current.uvi <= 2) {
        uvIndex.classList = "favorable";
        console.log("favorable");
      } else if (current.uvi > 2 && current.uvi <= 8) {
        uvIndex.classList = "moderate";
        console.log("moderate");
      } else if (current.uvi > 8) {
        uvIndex.classList = "severe";
        console.log("severe");
      }


      // append element to card 
      uvIndexEl.appendChild(uvIndex);
      currentCard.appendChild(h2);
      currentCard.appendChild(forecastIcon);
      currentCard.appendChild(temp);
      currentCard.appendChild(humidity);
      currentCard.appendChild(windspeed);
      currentCard.appendChild(uvIndexEl);

      // append card to currentDiv
      currentDiv.appendChild(currentCard);

      // let future = data.daily;
      // console.log(future);

      //futureDiv
      let heading = document.createElement("h2");
      let futureEl = document.createElement("div");
      // let futureCard = document.createElement('div');

      heading.textContent = "5-Day Forecast:";
      heading.classList = "mb-3";
      futureEl.classList = "d-inline-flex flex-wrap p-2";

      futureDiv.appendChild(heading);
      futureDiv.appendChild(futureEl);

      let future = data.daily;
      console.log(future);

      for (var i = 1; i <= 5; i++) {
        let dailyForecast = future[i];

        let futureCard = document.createElement("div");
        let h4 = document.createElement("h4");
        let weatherIcon = document.createElement("img");
        let futureTemp = document.createElement("p");
        let futureHumidity = document.createElement("p");

        futureCard.classList = "card bg-primary text-white m-1 text-center";
        h4.classList = "card-header";
        weatherIcon.classList = "card-body";
        futureTemp.classList = "card-body";
        futureHumidity.classList = "card-body";

        h4.textContent = moment.unix(dailyForecast.dt).format("MMM D, YYYY");
        futureTemp.textContent = "Temperature: " + ((dailyForecast.temp.day - 273.15) * (9 / 5) + 32).toFixed(0) + "°F";
        futureHumidity.textContent = "Humidity: " + dailyForecast.wind_speed + " mph";
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);

        futureCard.appendChild(h4);
        futureCard.appendChild(weatherIcon);
        futureCard.appendChild(futureTemp);
        futureCard.appendChild(futureHumidity);

        futureEl.appendChild(futureCard);
      }

    });
};

searchBtn.addEventListener("click", getWeather());

searchBtn.addEventListener("click", function(event) {
  event.preventDefault();

  let city = cityInput.value.trim();
  
  if(city) {
    getWeather(city);
    cities.unshift(city);
    cityInput.value = "";
  } else {
    alert("Please enter a City!");
  }

  localStorage.setItem("cities", JSON.stringify(cities));
});
