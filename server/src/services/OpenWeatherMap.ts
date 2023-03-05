import { Action, Description, Service } from "../area/mappings";
import { env } from "../config/env";
import { WeatherForecast, WeatherType } from "../interfaces/Weather";
import { nstring, ustring } from "../types/string";
import { IService } from "./IService";

/**
 * OpenWeatherMap service
 * 
 * This one's a bit special, it is not intended to push data to any webhook or api but rather to be read by other services using chained reactions.
 */
@Service
export class OpenWeatherMap implements IService {
    constructor() { this._outgoing = null; }
    static readonly WeatherType = WeatherType;

    read(data: any): void {
        // this._targetLat = data?.buffer?.lat;
        // this._targetLon = data?.buffer?.lon;
        this._targetCity = data?.buffer?.city;
    }

    setOutgoing(data: nstring): void {
        this._outgoing = data;
    }

    @Action
    @Description("Fill current weather")
    async fillCurrentWeather(): Promise<void> {
        let thisWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this._targetCity}&appid=${env.WEATHER_API_KEY}&units=metric`).then(res => res.json()).catch(e => console.error(e));
        this._temp = await thisWeather?.main?.temp + '°C';
        this._weather = await thisWeather?.weather?.[0]?.main;
        this._weatherType = WeatherType.Now;
    }

    @Action
    @Description("Fill hourly weather")
    async fillHourlyWeather(): Promise<void> {
        let thisWeather = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${this._targetCity}&appid=${env.WEATHER_API_KEY}&units=metric`).then(res => res.json()).catch(e => console.error(e));
        for (let item of (await thisWeather.list))
        {
            this._forecast.forecast.push({
                temp: item.main.temp,
                weather: item.weather[0].main,
                dt: item.dt_txt
            })
        }
        this._weatherType = WeatherType.Hourly;
    }

    _forecast: WeatherForecast = { forecast: [] };
    _weather: ustring;
    _temp: ustring;
    _weatherType: WeatherType = WeatherType.Default;
    _message: ustring;
    // _targetLat: ustring;
    // _targetLon: ustring;
    _targetCity: ustring;
    _outgoing: nstring;
}