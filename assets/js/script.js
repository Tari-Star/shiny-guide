function loadPage() {
  //variables for search
  var searchCity = document.querySelector(".srch-city");
  var searchBtn = document.querySelector("#srch-btn");
  var clearBtn = document.querySelector("#clear-history");
  var currentCity = document.querySelector(".crnt-city");
  var currentPic = document.querySelector("#current-pic");
  var currentTemp = document.querySelector(".crnt-temp");
  var currentHumidity = document.querySelector(".crnt-hmdt");
  var currentWind = document.querySelector(".crnt-wind");
  var currentUv = document.querySelector(".crnt-uv");
  var historyList = document.querySelector(".history");
  var sCity = JSON.parse(localStorage.getItem("search")) || [];
  console.log(sCity)

  // search city

   searchBtn.addEventListener("click", function () {
     var sTerm = searchCity.value;
     currentWeather(sTerm);
     sCity.push(sTerm);
     localStorage.setItem("search", JSON.stringify(sCity));
     displayWeather(sTerm);
     searchedCities();
   
   });
  clearBtn.addEventListener("click", function () {
    sCity = [];
    searchedCities();
  });
  // display current weather and 5day forecast
  function displayWeather(city) {
    currentWeather(city);
    forecast(city);
    searchedCities();

  }

  // display current weather
  function currentWeather(city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=imperial&appid=e0b9dd39426ecb04b13153bdbe50f759"
    )
      .then((response) => response.json())
      .then(function (response) {
        console.log(response);
        var date = new Date(response.dt * 1000).toLocaleDateString();

        //get image and description for current weather
        var iconUrl = response.weather[0].icon;
        currentPic.setAttribute(
          "src",
          "http://openweathermap.org/img/wn/" + iconUrl + "@2x.png"
        );
        currentPic.setAttribute("alt", response.weather[0].description);

        // populate  current weather data
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

  // forecast for 5 days
  function forecast(city) {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=e0b9dd39426ecb04b13153bdbe50f759`
    )
      .then((res) => res.json())
      .then(function (response) {
        const fiveDay = document.querySelector("#fiveDay");
        for (i = 0; i < 5; i++) {
          var forecastEls = document.createElement("div");
          forecastEls.setAttribute(
            "class",
            "col-sm-2 bg-primary forecast text-white m-2 mb-3 p-2 mt-2 rounded"
          );
          var forecastIndex = i * 8 + 4;
          //create date
          var forecastDate = new Date(response.list[forecastIndex].dt * 1000);
          var forecastDay = forecastDate.getDate();
          var forecastMonth = forecastDate.getMonth() + 1;
          var forecastYear = forecastDate.getFullYear();
          var forecastDateEl = document.createElement("p");
          forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
          forecastDateEl.innerHTML =
            forecastMonth + "/" + forecastDay + "/" + forecastYear;
          forecastEls.append(forecastDateEl);

          //create an image and alt to hold weather icon and description
          var forecastWeatherEl = document.createElement("img");
          forecastWeatherEl.setAttribute(
            "src",
            "http://openweathermap.org/img/wn/" +
              response.list[forecastIndex].weather[0].icon +
              "@2x.png"
          );
          forecastWeatherEl.setAttribute(
            "alt",
            response.list[forecastIndex].weather[0].description
          );
          forecastEls.append(forecastWeatherEl);

          //create element to hold temperature for 5 day
          var forecastTempEl = document.createElement("p");
          forecastTempEl.innerHTML =
            "Temp: " + response.list[forecastIndex].main.temp + " " + "&#8457";
          forecastEls.append(forecastTempEl);

          //create element to hold wind speed for 5 day
          var forecastWindEl = document.createElement("p");
          forecastWindEl.innerHTML =
            "Wind: " + response.list[forecastIndex].wind.speed + " " + "MPH";
          forecastEls.append(forecastWindEl);

          //create element to hold humidity for 5 day
          var forecastHmdtEl = document.createElement("p");
          forecastHmdtEl.innerHTML =
            "Humidity: " +
            response.list[forecastIndex].main.humidity +
            " " +
            "%";
          forecastEls.append(forecastHmdtEl);

          fiveDay.append(forecastEls);
        }
      });
  }
  // add searched city to history list
   function searchedCities() {
    historyList.innerHTML = "";
    for (var i = 0; i < sCity.length; i++){
      var hItem = document.createElement("input");
      var needsUpdating = sCity[i];
      var updated = needsUpdating[0].toUpperCase() + needsUpdating.substr(1);
      console.log("updated: ", updated);
      hItem.setAttribute("type", "text");
      hItem.setAttribute("readonly", true);
      hItem.setAttribute("class","form-control d-block bg-gray" );
      hItem.setAttribute("value", updated)
      hItem.addEventListener("click", function(){
        currentWeather(hItem.value);
      })
      historyList.append(hItem);
    }
   }
}
loadPage();
