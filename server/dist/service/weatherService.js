import dotenv from 'dotenv';
import dayjs from 'dayjs';
dotenv.config();
// TODO: Define a class for the Weather object
class Weather {
    constructor(temp, city, humidity, wind, date, img, imgText) {
        this.tempF = temp;
        this.city = city;
        this.humidity = humidity;
        this.windSpeed = wind;
        this.date = date;
        this.icon = img;
        this.iconDescription = imgText;
    }
}
// TODO: Complete the WeatherService class
class WeatherService {
    constructor() {
        // TODO: Define the baseURL, API key, and city name properties
        this.baseURL = process.env.API_BASE_URL || '';
        this.apiKey = process.env.API_KEY || '';
        this.city = '';
    }
    ;
    // TODO: Create fetchLocationData method
    async fetchLocationData(query) {
        const response = await fetch(query).then((res) => {
            return res.json();
        });
        return response[0];
    }
    // TODO: Create destructureLocationData method
    destructureLocationData(locationData) {
        console.log(locationData);
        const { lat, lon, name, country, state } = locationData;
        const coordinates = {
            name: name,
            lat: lat,
            lon: lon,
            country: country,
            state: state
        };
        return coordinates;
    }
    // TODO: Create buildGeocodeQuery method
    buildGeocodeQuery() {
        const query = `${this.baseURL}/geo/1.0/direct?q=${this.city}&appid=${this.apiKey}&limit=1`;
        console.log(query);
        return query;
    }
    // TODO: Create buildWeatherQuery method
    buildWeatherQuery(coordinates) {
        const query = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
        return query;
    }
    // TODO: Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData() {
        const coordinates = await this.fetchLocationData(this.buildGeocodeQuery()).then((data) => {
            return this.destructureLocationData(data);
        });
        return coordinates;
    }
    // TODO: Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        const response = await fetch(this.buildWeatherQuery(coordinates)).then((res) => res.json());
        if (!response) {
            console.log('no weather data');
            return [];
        }
        console.log(response.list[0]);
        const currentWeather = this.parseCurrentWeather(response.list[0]);
        console.log(currentWeather);
        const forecast = this.buildForecastArray(currentWeather, response.list);
        return forecast;
    }
    // TODO: Build parseCurrentWeather method
    parseCurrentWeather(response) {
        const dateFormatted = dayjs.unix(response.dt).format('M/D/YYYY');
        const currentWeather = new Weather(response.main.temp, this.city, response.main.humidity, response.wind.speed, dateFormatted, response.weather[0].icon, response.weather[0].description);
        return currentWeather;
    }
    // TODO: Complete buildForecastArray method
    buildForecastArray(currentWeather, weatherData) {
        const forecast = [];
        forecast.push(currentWeather);
        const weatherDataFilterd = weatherData.filter((data) => {
            return data.dt_txt.includes('12:00:00');
        });
        weatherDataFilterd.forEach((day) => {
            forecast.push(new Weather(day.main.temp, this.city, day.main.humidity, day.wind.speed, dayjs.unix(day.dt).format('M/D/YYYY'), day.weather[0].icon, day.weather[0].description));
        });
        console.log(forecast);
        return forecast;
    }
    // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city) {
        this.city = city;
        const coordinates = await this.fetchAndDestructureLocationData();
        console.log(coordinates);
        if (coordinates) {
            const weather = await this.fetchWeatherData(coordinates);
            return weather;
        }
        else {
            return [];
        }
    }
}
export default new WeatherService();
