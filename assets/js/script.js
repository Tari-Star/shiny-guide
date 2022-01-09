function loadPage() {
  //variables for search
  var searchCity = document.querySelector(".srch-city");
  var searchBtn = document.querySelector("#srch-btn");
  var currentCity = document.querySelector(".crnt-city");
  var currentPic = document.querySelector("#current-pic");
  var currentTemp = document.querySelector(".crnt-temp");
  var currentHumidity = document.querySelector(".crnt-hmdt");
  var currentWind = document.querySelector(".crnt-wind");
  var currentUv = document.querySelector(".crnt-uv");
  var searchHistory = JSON.parse(localStorage.getItem("search")) || [];
  console.log(searchHistory);

  // search city
  searchBtn.addEventListener("click", displayWeather);

  // display current weather and 5day forecast
  function displayWeather() {
    currentWeather();
    forecast();
  }

  // display current weather
  function currentWeather(city) {
    city = searchCity.value.trim();
    console.log(city);
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=imperial&appid=e0b9dd39426ecb04b13153bdbe50f759"
    )
      .then((response) => response.json())
      .then(function (response) {
        console.log(response);
        var date = new Date(response.dt * 1000).toLocaleDateString();

        //get weather icon and image
        var iconUrl = response.weather[0].icon;
        currentPic.setAttribute(
          "src",
          "http://openweathermap.org/img/wn/" + iconUrl + "@2x.png"
        );
        currentPic.setAttribute("alt", response.weather[0].description);

        currentCity.textContent = response.name + " " + "(" + date + ")";
        currentTemp.textContent = response.main.temp + " " + "°F";
        currentHumidity.textContent = response.main.humidity + " " + "%";
        currentWind.textContent = response.wind.speed + " " + "MPH";

        uvIndex(response.coord.lon, response.coord.lat);
      });
  }
  // get uv index
  function uvIndex(lon, lat) {
    var uvAPIURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=e0b9dd39426ecb04b13153bdbe50f759`;

    fetch(uvAPIURL)
      .then((response) => response.json())
      .then(function (response) {
        currentUv.textContent = response.current.uvi;
      });
  }
}
loadPage();
