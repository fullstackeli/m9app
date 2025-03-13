
import fs from 'node:fs/promises';
// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string){
    this.name = name;
    this.id = id
}}
// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    return await fs.readFile('db/db.json', {
      encoding: 'utf8'
    });
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
  return await fs.writeFile('db/db.json', JSON.stringify(cities));
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read().then((cities) => {
      if(cities) {
        return JSON.parse(cities);
      }
    });
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    if (!city) {
      console.log('no city')
      return
    }
    const id: string = (Math.floor(Math.random() * 10000000) + 1).toString();
    const newCity: City = {  id: id, name: city };

    const newCities = await this.getCities().then((cities) => {
        if (cities.find((i:any) => {i.name == city})) {
          return cities;
        } else {
        const citiesCopy:City[] = cities
          citiesCopy.push(newCity)
          return citiesCopy
        }
      })
      this.write(newCities)
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    return id
  }
}

export default new HistoryService();
