const cityElement = document.getElementById("city");
const fetchWeatherButton = document.getElementById("fetchWeather");
const weatherInfoDiv = document.getElementById("weatherInfo");

// Define background images for different weather conditions
const weatherBackgrounds = {
  Clear: 'url("images/clear.jpg")',
  "Partly Cloudy": 'url("images/partly_cloudy.jpeg")',
  Cloudy: 'url("images/cloudy.jpg")',
  Rain: 'url("images/rain.jpeg")',
  Thunderstorm: 'url("images/thunderstorm.jpg")',
  Snow: 'url("images/snow.jpeg")',
  default: 'url("images/default.jpg")',
};

const getWeather = async (city) => {
  const url = `https://yahoo-weather5.p.rapidapi.com/weather?location=${encodeURIComponent(
    city
  )}&format=json&u=c`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "dd8c584ea4msh652a2adb06d1bc2p11b6f5jsn15a848c33627",
      "x-rapidapi-host": "yahoo-weather5.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log(result);
    displayWeatherInfo(result);
    setDynamicBackground(result.current_observation.condition.text);
  } catch (error) {
    console.error("Fetch error:", error);
    weatherInfoDiv.innerHTML = "Error fetching weather information.";
  }
};

const displayWeatherInfo = (weather) => {
  const { location, current_observation, forecasts } = weather;
  if (location && current_observation) {
    weatherInfoDiv.innerHTML = `
    <divc class="weather">
      <h2 class="city">${location.city}, ${location.country}</h2>
      <p class="temp">${current_observation.condition.temperature}°C</p>
      <p class="condition">${current_observation.condition.text}</p>
      <p class="wind">Wind: ${current_observation.wind.speed} kph, ${
      current_observation.wind.direction
    }
      </p>
      <p class="wind_chill">Wind Chill: ${current_observation.wind.chill}°C</p>
      <p class="humidity">Humidity: ${
        current_observation.atmosphere.humidity
      }%</p>
      <p class="visibility">Visibility: ${
        current_observation.atmosphere.visibility
      } km</p>
      <p class="pressure">Pressure: ${
        current_observation.atmosphere.pressure
      } mb</p>
      <p class="sunrise">Sunrise: ${current_observation.astronomy.sunrise}</p>
      <p class="sunset">Sunset: ${current_observation.astronomy.sunset}</p>
      <div class="forecast">
        <h3 class="fore-head">Forecast</h3>
        ${forecasts
          .map(
            (forecast) => `
          <div class="forecast-item">
            <strong class="forecast-day">${forecast.day}</strong> ${forecast.text} - High: ${forecast.high}°C, Low: ${forecast.low}°C
          </div>
        `
          )
          .join("")}
      </div>
      </div>
    `;
  } else {
    weatherInfoDiv.innerHTML = "No weather information available.";
  }
};

const setDynamicBackground = (condition) => {
  const background =
    weatherBackgrounds[condition] || weatherBackgrounds.default;
  document.body.style.backgroundImage = background;
};

fetchWeatherButton.addEventListener("click", () => {
  const city = cityElement.value.trim(); // Get the value from the input element and trim whitespace
  if (city) {
    getWeather(city);
  } else {
    weatherInfoDiv.innerHTML = "Please enter a city name.";
  }
});
