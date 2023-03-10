import { services } from "../services/.services";
import { area } from "../area/.area";
import { WeatherType } from "../services/OpenWeatherMap";
import { ustring } from "../types/string";
import { Transcoder } from "../area/mappings";
import moment, { Moment } from "moment";

export class transcoders
{
    @area.Transcoder(services.Discord.name, services.TeamScript.name)
    static discordToTeams(discord: services.Discord): services.TeamScript {
        var teams: services.TeamScript = new services.TeamScript();
        teams._authorName = discord._authorName;
        teams._message = discord._message;
        teams._durationHours = discord._durationHours;
        teams._durationMinutes = discord._durationMinutes;
        teams._startDateTime = moment(discord._startDateTime);
        teams._subject = discord._subject;
        return teams;
    }
    
    @area.Transcoder(services.TeamScript.name, services.Discord.name)
    static teamsToDiscord(teams: services.TeamScript): services.Discord {
        var discord: services.Discord = new services.Discord();
        discord._authorName = teams._authorName;
        discord._message = teams._message;
        discord._durationHours = teams._durationHours;
        discord._durationMinutes = teams._durationMinutes;
        discord._startDateTime = moment(teams._startDateTime);
        discord._subject = teams._subject;
        return discord;
    }

    @area.Transcoder(services.Discord.name, services.Github.name)
    static discordToGithub(discord: services.Discord): services.Github {
        var github: services.Github = new services.Github();

        github._owner = discord._owner;
        github._repo = discord._repo;
        github._title = discord._title;
        github._body = discord._body;
        github._userId = discord._authorName;
        return github;
    }

    @area.Transcoder(services.Github.name, services.Discord.name)
    static githubToDiscord(github: services.Github): services.Discord {
        var discord: services.Discord = new services.Discord();

        discord._owner = github._owner;
        discord._repo = github._repo;
        discord._title = github._title;
        discord._body = github._body;
        discord._authorName = github._userId;

        discord._message = "This is the repo's issue list:\n";
        for (let issue of github._issues.issues)
        {
            discord._list.list.push({
                author: {
                    name: issue.author || ""
                },
                title: issue.title,
                footer: {
                    text: "Issue #" + issue.number
                },
                description: issue.body || "",
                color: 0x00ff00
            });

            discord._message += `> Issue #${issue.number}: ${issue.title} assigned to ${issue.author}\n`;
        }

        return discord;
    }

    @area.Transcoder(services.Github.name, services.TeamScript.name)
    static githubToTeamScript(github: services.Github): services.TeamScript {
        var teamScript: services.TeamScript = new services.TeamScript();

        teamScript._issues = github._issues;
        teamScript._authorId = github._owner;
        teamScript._repository = github._repo;
        teamScript._title = github._title;
        teamScript._message = github._body;

        return teamScript;
    }

    @area.Transcoder(services.TeamScript.name, services.Github.name)
    static teamScriptToGithub(teamScript: services.TeamScript): services.Github {
        var github: services.Github = new services.Github();

        github._issues = teamScript._issues;
        github._owner = teamScript._authorId;
        github._repo = teamScript._repository;
        github._title = teamScript._title;
        github._body = teamScript._message;

        return github;
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
                    title: item.temp + "??C",
                    description: "<t:" + Math.floor(Date.parse(String(item.dt)) / 1000) + ":f>",
                    color: weatherColor(item.weather),
                    author: {
                        name: item.weather
                    },
                    footer: {
                        text: openWeatherMap._targetCity || ""
                    }
                });

                discord._message += "<t:" + Math.floor(Date.parse(String(item.dt)) / 1000) + ":f>" + ": " + item.temp + "??C, " + item.weather + "\n";
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
        google._startDateTime = moment(discord._startDateTime);
        google._startDateTime.format("YYYY-MM-DDTHH:mm:ss");
        google._durationHours = discord._durationHours;
        google._durationMinutes = discord._durationMinutes;
        google._userId = discord._authorName;
        google._location = discord._city;
        return google;
    }

    @Transcoder(services.Google.name, services.Discord.name)
    static googleToDiscord(google: services.Google): services.Discord {
        let discord: services.Discord = new services.Discord();
        discord._subject = google._summary;
        discord._message = google._description;
        discord._startDateTime = moment(google._startDateTime);
        discord._durationHours = google._durationHours;
        discord._durationMinutes = google._durationMinutes;
        discord._authorName = google._userId;
        discord._city = google._location;
        return discord;
    }

    @Transcoder(services.Discord.name, services.HackTheBox.name)
    static discordToHackTheBox(discord: services.Discord): services.HackTheBox {
        let hackTheBox: services.HackTheBox = new services.HackTheBox();
        hackTheBox._userId = discord._authorName;
        hackTheBox._message = discord._message;
        hackTheBox._targetUser = discord._targetUser;
        hackTheBox._targetUserName = discord._targetUserName;
        return hackTheBox;
    }

    @Transcoder(services.HackTheBox.name, services.Discord.name)
    static hackTheBoxToDiscord(hackTheBox: services.HackTheBox): services.Discord {
        let discord: services.Discord = new services.Discord();
        discord._authorName = hackTheBox._userId;
        discord._message = hackTheBox._message;
        discord._targetUser = hackTheBox._targetUser;
        discord._targetUserName = hackTheBox._targetUserName;
        return discord;
    }
    
}
