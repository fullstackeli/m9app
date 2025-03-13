import dotenv from 'dotenv';
import dayjs, { type Dayjs } from 'dayjs';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
  name: string;
  country: string;
  state: string;
}
// TODO: Define a class for the Weather object

class Weather {
  tempF: number;
  city: string;
  humidity: number;
  windSpeed: number;
  date: Dayjs | string;
  icon: string;
  iconDescription: string;

  constructor(
    temp: number,
    city: string,
    humidity: number,
    wind: number,
    date: Dayjs | string,
    img: string,
    imgText: string
  )  {
    this.tempF = temp
    this.city = city
    this.humidity = humidity
    this.windSpeed = wind
    this.date = date
    this.icon = img
    this.iconDescription = imgText;
  }

} 

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  baseURL: string = process.env.API_BASE_URL || '';
  apiKey: string = process.env.API_KEY || '';;
  city: string = '';
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response: Coordinates[] = await fetch(query).then((res) => {
      return res.json()
    });
    return response[0];
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    console.log(locationData)
    const {lat, lon, name, country, state } = locationData

    const coordinates: Coordinates = {
      name: name,
      lat: lat,
      lon: lon,
      country: country,
      state: state
    }
    return coordinates;
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const query: string = `${this.baseURL}/geo/1.0/direct?q=${this.city}&appid=${this.apiKey}&limit=1`
    console.log(query)
    return query;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const query: string = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    return query;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const coordinates: Coordinates = await this.fetchLocationData(this.buildGeocodeQuery()).then((data) => {
      return this.destructureLocationData(data)
    });
    return coordinates;
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates)).then((res) => res.json());
    if (!response) {
      console.log('no weather data');
      return []
    }
    console.log(response.list[0])
    const currentWeather: Weather = this.parseCurrentWeather(response.list[0])
    console.log(currentWeather)
    const forecast: Weather[] = this.buildForecastArray(currentWeather,response.list);
    return forecast;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const dateFormatted = dayjs.unix(response.dt).format('M/D/YYYY')
    const currentWeather = new Weather(
      response.main.temp,
      this.city,
      response.main.humidity,
      response.wind.speed,
      dateFormatted,
      response.weather[0].icon,
      response.weather[0].description
    )
    return currentWeather;
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecast: Weather[] = [];
    forecast.push(currentWeather)

    const weatherDataFilterd = weatherData.filter((data: any) => {
      return data.dt_txt.includes('12:00:00');
    });
    
    weatherDataFilterd.forEach((day: any) => {
      forecast.push( new Weather(
        day.main.temp,
          this.city,
          day.main.humidity,
          day.wind.speed,
          dayjs.unix(day.dt).format('M/D/YYYY'),
          day.weather[0].icon,
          day.weather[0].description
        ));
    });
    console.log(forecast)
    return forecast;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.city = city;
    const coordinates: Coordinates = await this.fetchAndDestructureLocationData();
    console.log(coordinates)
    if (coordinates) {
      const weather: Weather[] = await this.fetchWeatherData(coordinates)
      return weather
    } else {
      return []
    }
  }
}

export default new WeatherService();
