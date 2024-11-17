const chai = require("chai");
const expect = chai.expect;
const {
  getWeatherForTask,
  getWeatherForcast,
} = require("../../services/weatherService");

describe("Weather Service Integration Tests", function () {
  // Allow longer timeouts for external API calls
  this.timeout(10000); // 10 seconds

  

  describe("getWeatherForTask", () => {
    it("should return weather data for a given task and city", async () => {
      const task = { date: "2024-09-08", time: "12:00" };
      const city = "paris";

      const weather = await getWeatherForTask(task, city);

      expect(weather).to.have.property("temp").that.is.a("number");
      expect(weather).to.have.property("description").that.is.a("string");
      expect(weather)
        .to.have.property("icon")
        .that.includes("openweathermap.org/img/wn/");
    });
  });

  describe("getWeatherForcast", () => {
    it("should return current temperature and forecast for a city", async () => {
      const city = "Paris";

      const forecast = await getWeatherForcast(city);

      expect(forecast).to.have.property("currentTemp").that.is.a("string");
      expect(forecast)
        .to.have.property("currentIcon")
        .that.includes("openweathermap.org/img/wn/");
      expect(forecast.forecast).to.be.an("array").that.is.not.empty;

      forecast.forecast.forEach((entry) => {
        expect(entry).to.have.property("time").that.is.a("string");
        expect(entry)
          .to.have.property("icon")
          .that.includes("openweathermap.org/img/wn/");
        expect(entry).to.have.property("temp").that.is.a("string");
      });
    });
  });
});
