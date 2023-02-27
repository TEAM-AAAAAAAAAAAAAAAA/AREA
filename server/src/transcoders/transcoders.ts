import { services } from "../services/.services";
import { area } from "../area/.area";
import { WeatherType } from "../services/OpenWeatherMap";
import { ustring } from "../types/string";

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
        openWeatherMap._targetCity = discord._message;
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

        var discord: services.Discord = new services.Discord();
        let when: string = "";
        if (openWeatherMap._weatherType == WeatherType.Now)
            when = "now";

        discord._message = "Weather " + when + ": ";
            
        addWeatherParam(openWeatherMap._weather);
        addWeatherParam(openWeatherMap._temp);

        return discord;
    }
    
}
