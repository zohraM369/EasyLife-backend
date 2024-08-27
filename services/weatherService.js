const { default: axios } = require("axios");

const getWeatherForTask = async (task, city) => {
  console.log(task, city);
  try {
    const dateTime = new Date(`${task.date}T${task.time}`);
    const timestamp = Math.floor(dateTime.getTime() / 1000);

    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHERMAP_API_KEY}&dt=${timestamp}`
    );
    return {
      temp: Math.round(response.data.main.temp - 273.15), // convertir la temperature
      description: response.data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new Error("Unable to fetch weather data");
  }
};

const getWeatherForcast = async (city) => {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    const dailyForecasts = data.list.slice(0, 12).map((entry) => {
      const time = new Date(entry.dt_txt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const icon = `http://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`;
      const temp = `${Math.round(entry.main.temp)}°`;

      return { time, icon, temp };
    });

    return {
      currentTemp: `${Math.round(data.list[0].main.temp)}°`,
      currentIcon: `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`,
      forecast: dailyForecasts,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new Error("Failed to fetch weather data");
  }
};

module.exports = {
  getWeatherForTask,
  getWeatherForcast,
};
