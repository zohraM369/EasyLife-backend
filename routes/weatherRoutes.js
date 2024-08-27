const express = require('express');
const weatherController = require('../controllers/weatherController');

const router = express.Router();

router.post('/weather', weatherController.getWeatherForTask);
router.get('/get_weather_forcast/:city',weatherController.getWeatherForcast)
module.exports = router;