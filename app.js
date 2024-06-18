let searchButton = document.querySelector(".search-button");
let searchInput = document.querySelector(".search-input");
const weatherCards = document.querySelector(".days");
const currentWeather = document.querySelector(".current-weather");
const locationButton = document.querySelector(".Location");
const API_KEY = "4929cad812f79a8e7c6af498b1f872e6"; //APi key from openweathermap.com

const createCard = (cityName, weatherItem, index) => {
  if (index === 0) {
    return `
                <div class="current-weather">
                    <div class="details">
                        <h2>${cityName} (${
      weatherItem.dt_txt.split(" ")[0]
    })</h2>
                        <h4>Temperature:${(
                          weatherItem.main.temp - 273.1
                        ).toFixed(2)}&degC</h4>
                        <h4>Wind:${weatherItem.wind.speed}M/S</h4>
                        <h4>Humidity:  ${weatherItem.main.humidity}%</h4>
                    </div>
                    <div class="icon">
                        <img src="https://openweathermap.org/img/wn/${
                          weatherItem.weather[0].icon
                        }@4x.png">
                        <h2>${weatherItem.weather[0].description}</h2>
                    </div>
                </div>
        `;
  } else {
    return `
    <li>
        <h2>${weatherItem.dt_txt.split(" ")[0]}</h2>
        <img src="https://openweathermap.org/img/wn/${
          weatherItem.weather[0].icon
        }@2x.png">
        <h4>Temp:  ${(weatherItem.main.temp - 273.1).toFixed(2)}&degC</h4>
        <h4>Wind:  ${weatherItem.wind.speed} M/S</h4>
        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
    </li>
    `;
  }
};

const getWeatherDetails = (cityName, lat, lon) => {
  const WeatherApiDetails = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY} `;
  fetch(WeatherApiDetails)
    .then((res) => res.json())
    .then((data) => {
      const uniqueForecastDays = [];
      console.log(data);
      const fiveDaysForecast = data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });
      weatherCards.innerHTML = "";
      searchInput.value = "";
      currentWeather.innerHTML = "";

      console.log(fiveDaysForecast);
      fiveDaysForecast.forEach((weatherItem, index) => {
        if (index === 0) {
          currentWeather.insertAdjacentHTML(
            "beforeend",
            createCard(cityName, weatherItem, index)
          );
        } else {
          weatherCards.insertAdjacentHTML(
            "beforeend",
            createCard(cityName, weatherItem, index)
          );
        }
      });
    })
    .catch(() => {
      alert("error while fetching forecast days");
    });
};
const GetCityWeather = () => {
  const cityName = searchInput.value.trim();
  if (!cityName) return;
  //   console.log(cityName);
  const GEOCODING_API_KEY = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  fetch(GEOCODING_API_KEY)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) return alert(`no coordinates for ${cityName}`);
      const { name, lat, lon } = data[0];
      getWeatherDetails(name, lat, lon);
      console.log(data);
    })
    .catch(() => {
      alert("error happened while fetching data");
    });
};

const getLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const REVERSE_GEOLOCATION_API = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
      fetch(REVERSE_GEOLOCATION_API)
        .then((res) => res.json())
        .then((data) => {
          const { name, lat, lon } = data[0];
          getWeatherDetails(name, latitude, longitude);
          console.log(data);
        });
      console.log(position);
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        alert("geolocation request denied");
      }
    }
  );
};

searchButton.addEventListener("click", GetCityWeather);
locationButton.addEventListener("click", getLocation);
