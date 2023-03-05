export enum WeatherType {
    Default,
    Now,
    Hourly
};

export interface WeatherForecast {
    forecast: Weather[];
}

export interface Weather {
    temp: number;
    weather: string;
    dt: Date;
}