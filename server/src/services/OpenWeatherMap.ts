import { area } from "../area/.area";
import { Description } from "../area/mappings";
import { env } from "../config/env";
import { nstring, ustring } from "../types/string";
import { IService } from "./IService";

export enum WeatherType {
    Default,
    Now
};

@area.Service
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

    @area.Action
    @Description("Fill current weather")
    async fillCurrentWeather(): Promise<void> {
        let thisWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this._targetCity}&appid=${env.WEATHER_API_KEY}&units=metric`).then(res => res.json());
        this._temp = await thisWeather?.main?.temp  + '°C';
        this._weather = await thisWeather?.weather?.[0]?.main;
        this._weatherType = WeatherType.Now;

        console.log(this._targetCity, this._temp, this._weather);
    }

    // _buffer: any = {};
    _weather: ustring;
    _temp: ustring;
    _weatherType: WeatherType = WeatherType.Default;
    _message: ustring;
    // _targetLat: ustring;
    // _targetLon: ustring;
    _targetCity: ustring;
    _outgoing: nstring;
}