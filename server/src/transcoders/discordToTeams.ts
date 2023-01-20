import { services } from "../services/.services";

export function discordToTeams(discord: services.Discord): services.Teams {
    var teams: services.Teams = new services.Teams();
    teams._authorId = discord._authorId;
    teams._authorName = discord._authorName;
    teams._message = discord._message;
    return teams;
}
