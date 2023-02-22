import { services } from "../services/.services";
import { area } from "../area/.area";

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
    
}
