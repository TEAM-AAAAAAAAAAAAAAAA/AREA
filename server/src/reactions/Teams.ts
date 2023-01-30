import { services } from "../services/.services"

export class Teams {
    static sendMessage(service: services.Teams): void
    {
        // push
        console.log(service.getNormalText());
        console.log("wait, that should be displayed on teams");
    }

    static sendMeeting(service: services.Teams): void
    {
        // push cool meeting embed
    }
}
