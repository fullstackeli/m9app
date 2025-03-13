import { Router } from 'express';
const router = Router();
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
// TODO: POST Request with city name to retrieve weather data
router.post('/', (req, res) => {
    // TODO: GET weather data from city name
    const city = req.body.cityName;
    // TODO: save city to search history
    WeatherService.getWeatherForCity(city).then(function (data) {
        HistoryService.addCity(city);
        res.json(data);
    });
});
// TODO: GET search history
router.get('/history', async (_req, res) => {
    const cities = await HistoryService.getCities();
    res.json(cities);
});
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req, res) => {
    res.send(200);
});
export default router;
