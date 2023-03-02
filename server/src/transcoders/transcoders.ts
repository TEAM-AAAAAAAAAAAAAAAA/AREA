import { services } from "../services/.services";
import { area } from "../area/.area";
import { WeatherType } from "../services/OpenWeatherMap";
import { ustring } from "../types/string";
import { Transcoder } from "../area/mappings";

export class transcoders
{
    @area.Transcoder(services.Discord.name, services.Teams.name)
    static discordToTeams(discord: services.Discord): services.Teams {
        var teams: services.Teams = new services.Teams();
        teams._authorName = discord._authorName;
        teams._message = discord._message;
        teams._year = discord._year;
        teams._month = discord._month;
        teams._day = discord._day;
        teams._hour = discord._hour;
        teams._minute = discord._minute;
        teams._subject = discord._subject;
        return teams;
    }
    
    @area.Transcoder(services.Teams.name, services.Discord.name)
    static teamsToDiscord(teams: services.Teams): services.Discord {
        var discord: services.Discord = new services.Discord();
        discord._authorName = teams._authorName;
        discord._message = teams._message;
        discord._year = teams._year;
        discord._month = teams._month;
        discord._day = teams._day;
        discord._hour = teams._hour;
        discord._minute = teams._minute;
        discord._subject = teams._subject;
        return discord;
    }

    @area.Transcoder(services.Discord.name, services.OpenWeatherMap.name)
    static discordToOpenWeatherMap(discord: services.Discord): services.OpenWeatherMap {
        var openWeatherMap: services.OpenWeatherMap = new services.OpenWeatherMap();
        openWeatherMap._targetCity = discord._city;
        // openWeatherMap._targetLat = discord._buffer?.lat;
        // openWeatherMap._targetLon = discord._buffer?.lon;
        return openWeatherMap;
    }

    @area.Transcoder(services.OpenWeatherMap.name, services.Discord.name)
    static openWeatherMapToDiscord(openWeatherMap: services.OpenWeatherMap): services.Discord {
        var isFirst: boolean = true;
        function addWeatherParam(param: ustring) : void
        {
            if (param)
            {
                if (!isFirst)
                    discord._message += ', ';
                else
                    isFirst = false;
                discord._message += param;
            }
        }
        function weatherColor(weather: string) : number {
            switch (weather)
            {
                case "Clear": return 16776960;
                case "Clouds": return 12370112;
                case "Rain": return 3447003;
                case "Snow": return 16777215;
                case "Thunderstorm": return 7419530;
                case "Drizzle": return 10070709;
                default: return 9936031;
            }
        }

        var discord: services.Discord = new services.Discord();
        let when: string = "";

        if (openWeatherMap._weatherType != WeatherType.Now)
        {
            discord._message = "Weather forecast for " + openWeatherMap._targetCity + ":\n";
            for (let item of openWeatherMap._forecast.forecast)
            {
                discord._list.list.push({
                    title: item.temp + "°C",
                    description: "<t:" + Math.floor(Date.parse(String(item.dt)) / 1000) + ":f>",
                    color: weatherColor(item.weather),
                    author: {
                        name: item.weather
                    },
                    footer: {
                        text: openWeatherMap._targetCity || ""
                    }
                });

                discord._message += "<t:" + Math.floor(Date.parse(String(item.dt)) / 1000) + ":f>" + ": " + item.temp + "°C, " + item.weather + "\n";
            }
        } else {
            if (openWeatherMap._weatherType == WeatherType.Now)
                when = "now";

            discord._message = "Weather " + when + ": ";
                
            addWeatherParam(openWeatherMap._weather);
            addWeatherParam(openWeatherMap._temp);
        }
        return discord;
    }

    @Transcoder(services.Discord.name, services.Google.name)
    static discordToGoogle(discord: services.Discord): services.Google {
        let google: services.Google = new services.Google();
        google._summary = discord._subject;
        google._description = discord._message;
        let today = new Date();
        google._startDateTime = String(new Date(discord._year || today.getFullYear(), discord._month || today.getMonth(), discord._day || today.getDate(), discord._hour || today.getHours(), discord._minute || today.getMinutes()));
        google._endDateTime = String(new Date(discord._year || today.getFullYear(), discord._month || today.getMonth(), discord._day || today.getDate(), (discord._hour || today.getHours()) + 1, discord._minute || today.getMinutes()));
        google._userId = discord._authorName;
        google._location = discord._city;
        return google;
    }
    
}
