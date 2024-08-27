const weatherService = require("../services/weatherService");

const getWeatherForTask = async (req, res) => {
  const { task, city } = req.body;

  try {
    const weatherData = await weatherService.getWeatherForTask(task, city);
    return res.json({ result: true, data: weatherData });
  } catch (error) {
    return res.json({ result: false, err: error.message });
  }
};

const getWeatherForcast = async (req, res) => {
  const city = req.params.city;

  if (!city) {
    return res
      .status(400)
      .json({ error: "City and country code are required" });
  }

  try {
    const weatherData = await weatherService.getWeatherForcast(city);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getWeatherForTask,
  getWeatherForcast,
};
