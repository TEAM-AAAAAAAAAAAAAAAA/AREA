import { area } from "../area/.area";
import { env } from "../config/env";
import { nstring, ustring } from "../types/string";
import { IService } from "./IService";

@area.Service
export class OpenWeatherMap implements IService {
    constructor() { this._outgoing = null; }

    read(data: any): void {
        this._targetLat = data?.buffer?.lat;
        this._targetLon = data?.buffer?.lon;
        this._targetCity = data?.buffer?.city;
    }

    setOutgoing(data: nstring): void {
        this._outgoing = data;
    }

    async fillWeather(context: string, delay: number): Promise<void> {
        if (!this._targetLat || !this._targetLon) {
            if (!this._targetCity) return;

            let thisLocation = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${this._targetCity}&appid=${env.WEATHER_API_KEY}`).then(res => res.json());
            this._targetCity = await thisLocation?.[0]?.name;
            this._targetLat = await thisLocation?.[0]?.lat;
            this._targetLon = await thisLocation?.[0]?.lon;
        }
        
        console.log(this._targetCity, this._targetLat, this._targetLon);
        let thisWeather = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${this._targetLat}&lon=${this._targetLon}&appid=${env.WEATHER_API_KEY}&units=metric`).then(res => res.json());
        this._buffer = {
            city: this._targetCity,
            temp: await thisWeather?.[context]?.[delay]?.temp,
            weather: await thisWeather?.[context]?.weather?.[0]?.description,
        };
        console.log(thisWeather);
        console.log(thisWeather?.[context]?.[delay]?.temp);
    }

    @area.Action
    async fillCurrentWeather(): Promise<void> {
        await this.fillWeather('hourly', 0);

        console.log(this._buffer);
    }

    _buffer: any = {};
    _message: ustring;
    _targetLat: ustring;
    _targetLon: ustring;
    _targetCity: ustring;
    _outgoing: nstring;
}