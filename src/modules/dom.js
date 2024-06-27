import { getWeather, get10DayForecast } from "./logic";
import "../style/dom.css";
import rainVideo from "../videos/rain.mp4";
import snowVideo from "../videos/snowy.mp4";
import sunnyVideo from "../videos/sunny.mp4";
import windyVideo from "../videos/windy.mp4";

import sunnyIcon from "../images/sunnyIcon.png";
import rainyIcon from "../images/rainIcon.gif";

export default function displayData() {
  // deafult Location
  const location = "New York";

  // try get10dayForecast
  get10DayForecast(location)
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error(err.message);
    });

  getWeather(location)
    .then((data) => {
      displayWeather(data);
      updateVideoBackground(data);
    })
    .catch((err) => {
      console.error(err.message);
    });
  const videoElement = document.getElementById("video-bg");

  let locationInput = document.getElementById("location-input");
  locationInput.addEventListener("keydown", async (event) => {
    if (event.keyCode === 13) {
      let data = await getWeather(locationInput.value);

      displayWeather(data);
      updateVideoBackground(data);
      displayUVIndex(data);
      displayWindConditions(data);

      let forecastData = await get10DayForecast(locationInput.value);
      update10DayForecast(forecastData);

      locationInput.value = "";
    }
  });
}

function displayWeather(data) {
  displayTemperature(data);
  displayComponents(data);
}

function displayTemperature(data) {
  const country = data.location.country;
  const city = data.location.name;
  const tempInCel = data.current.temp_c;
  const tempInFahrenheit = data.current.temp_f;
  const condition = data.current.condition.text;

  let temp = document.getElementById("temp");
  temp.textContent = `${tempInCel}°C / ${tempInFahrenheit}°F`;
  let text = document.getElementById("weather-text");
  text.textContent = condition;
  let countryCity = document.getElementById("country-city");
  countryCity.textContent = `${country}, ${city}`;
}

function displayComponents(data) {
  const feelsLike = data.current.feelslike_c;
  const precipitation = data.current.precip_mm;
  const visibility = data.current.vis_km;
  const humidity = data.current.humidity;

  let feelsLikeElement = document.getElementById("feels-like");
  feelsLikeElement.querySelector("h3").textContent = `${feelsLike}°C`;

  let feelsLikeComment = "";
  if (feelsLike > data.current.temp_c) {
    feelsLikeComment = "Humidity makes it feel warmer";
  } else if (feelsLike < data.current.temp_c) {
    feelsLikeComment = "Wind makes it feel cooler";
  } else {
    feelsLikeComment = "Feels like the actual temperature";
  }
  feelsLikeElement.querySelector("p").textContent = feelsLikeComment;

  let precipitationElement = document.getElementById("ppt");
  precipitationElement.querySelector("h2").textContent = `${precipitation} mm`;

  let visibilityElement = document.getElementById("visibilty");
  visibilityElement.querySelector("h2").textContent = `${visibility} km`;

  let humidityElement = document.getElementById("humidity");
  humidityElement.querySelector("h2").textContent = `${humidity}%`;
}

function updateVideoBackground(data) {
  const tempInCel = data.current.temp_c;
  const condition = data.current.condition.text.toLowerCase();

  const videoElement = document.getElementById("video-bg");
  videoElement.innerHTML = ""; // Clear previous video source

  let source = document.createElement("source");

  if (condition.includes("rain")) {
    source.src = rainVideo;
  } else if (condition.includes("snow")) {
    source.src = snowVideo;
  } else if (condition.includes("sunny") || tempInCel > 20) {
    source.src = sunnyVideo;
  } else if (condition.includes("windy")) {
    source.src = windyVideo;
  } else {
    source.src = sunnyVideo; // Default to sunny video if condition is not specified
  }

  videoElement.appendChild(source);
  videoElement.load(); // Reload video to apply new source
}

function update10DayForecast(data) {
  let forecastContainer = document.getElementById("forecast-content");
  forecastContainer.innerHTML = "";

  data.forecast.forecastday.forEach((day) => {
    const date = day.date;
    const temp = day.day.avgtemp_c;
    const condition = day.day.condition.text.toLowerCase();
    let icon = sunnyIcon;

    if (condition.includes("rain")) {
      icon = rainyIcon;
    }

    const forecastDiv = document.createElement("div");
    forecastDiv.classList.add("dayComp");
    forecastDiv.innerHTML = `
      <h4>${date}</h4>
      <h2>${temp}°C</h2>
      <img src="${icon}" alt="${condition}" />
    `;

    forecastContainer.appendChild(forecastDiv);
  });
}

function displayUVIndex(data) {
  const uvIndex = data.current.uv;

  let uvIndexElement = document.getElementById("detail-content");
  uvIndexElement.innerHTML = `
    <p>UV Index: ${uvIndex}</p>
  `;
}

function displayWindConditions(data) {
  const windSpeed = data.current.wind_kph;
  const windDirection = data.current.wind_dir;

  let windConditionElement = document.getElementById("wind-detail-content");
  windConditionElement.innerHTML = `
    <p>Wind Speed: ${windSpeed} kph</p>
    <p>Wind Direction: ${windDirection}</p>
  `;
}
