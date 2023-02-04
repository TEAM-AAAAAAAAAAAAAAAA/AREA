import { services } from "../services/.services"

export class Teams {
    static postMessage(service: services.Teams): void
    {
        // push
        console.log(service.getMessage());
        console.log("wait, that should be displayed on teams");
    }

    static postMeeting(service: services.Teams): void
    {
        // push cool meeting embed
    }
}
