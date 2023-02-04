import { services } from "../services/.services";

export function teamsToDiscord(teams: services.Teams): services.Discord {
    var discord: services.Discord = new services.Discord();
    discord._authorName = teams._authorName;
    discord._message = teams._message;
    return discord;
}
