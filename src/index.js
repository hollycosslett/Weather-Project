function convertMPStoMPH(mps) {
  let mph = (mps /= 0.44704);
  let roundedMph = Math.round(mps);
  return roundedMph;
}

function refreshWeather(response) {
  let temperatureElement = document.querySelector("#weather-degrees");
  let temperature = response.data.temperature.current;

  let cityElement = document.querySelector("#city");
  let city = response.data.city;

  let descriptionElement = document.querySelector("#description");
  let description = response.data.condition.description;

  let humidityElement = document.querySelector("#humidity");
  let humidity = `${response.data.temperature.humidity}%`;

  let windSpeedElement = document.querySelector("#wind-speed");
  let windSpeed = `${convertMPStoMPH(response.data.wind.speed)} mph`;

  let timeElement = document.querySelector("#time");

  let date = new Date(response.data.time * 1000);

  let icon = document.querySelector("#icon");

  cityElement.innerHTML = city;
  timeElement.innerHTML = formatDate(date);
  descriptionElement.innerHTML = description;
  humidityElement.innerHTML = humidity;
  temperatureElement.innerHTML = Math.round(temperature);
  windSpeedElement.innerHTML = windSpeed;
  icon.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-icon"/>`;

  getForecast(response.data.city);
}
function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${day}: ${hours}:${minutes}`;
}
function searchCity(city) {
  let apiKey = "48d9c02baa93fa8d733783cd33ot621f";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(refreshWeather);
}

function searchCitySubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = searchInput.value;
  searchCity(searchInput.value);
}

function getForecast(city) {
  let apiKey = "48d9c02baa93fa8d733783cd33ot621f";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function getDate(time) {
  let date = new Date(time * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");

  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml =
        forecastHtml +
        `<div class="weather-forecast-day">
            <div class="weather-forecast-date">${getDate(day.time)}</div>
            <div >
            <img src="${
              day.condition.icon_url
            }"class="weather-forecast-icon"/></div>
            <div class="weather-temperatures">
              <span class="weather-forecast-temperature-max">${Math.round(
                day.temperature.maximum
              )}°</span>
              <span class="weather-forecast-temperature-min">${Math.round(
                day.temperature.minimum
              )}°</span>
            </div>
          </div>`;
    }
  });
  forecastElement.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", searchCitySubmit);

searchCity("London");
