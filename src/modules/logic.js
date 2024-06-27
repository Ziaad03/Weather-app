async function getWeather(location) {
  const apiKey = "129d5777901649198b8110605242506";
  try {
    let response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`,
      { mode: "cors" }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const weatherData = await response.json();

    // Check if the API returned an error
    if (weatherData.error) {
      throw new Error(weatherData.error.message);
    }

    return weatherData;
  } catch (err) {
    // Handle specific errors or return a generic error message
    if (err.message.includes("No matching location found")) {
      console.error("The location entered does not exist.");
    } else {
      console.error("An error occurred: ", err.message);
    }
    return { error: err.message };
  }
}

async function get10DayForecast(location) {
  const apiKey = "129d5777901649198b8110605242506";
  try {
    let response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=10`,
      { mode: "cors" }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const forecastData = await response.json();

    // Check if the API returned an error
    if (forecastData.error) {
      throw new Error(forecastData.error.message);
    }

    return forecastData;
  } catch (err) {
    // Handle specific errors or return a generic error message
    console.error("An error occurred: ", err.message);
    return { error: err.message };
  }
}

export { getWeather, get10DayForecast };
