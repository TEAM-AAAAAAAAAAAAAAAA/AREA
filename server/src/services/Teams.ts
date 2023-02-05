import { ustring } from "../types/ustring";
import { area } from "../area/.area";
import { IService } from "./IService";

@area.Service
export class Teams implements IService {
    read(data: any): void {
        this._authorId = data?.from?.id;
        this._authorName = data?.from?.name
        this._message = data?.text?.substring(data?.text?.indexOf(';') + 1, data?.text?.length - 1);
    }
    
    @area.Reaction
    postMessage(): void
    {
        // push
        console.log(this._message);
        console.log("wait, that should be displayed on teams");
    }

    @area.Reaction
    postMeeting(): void
    {
        console.log("meeting time")
        // push cool meeting embed
    }

    _authorId: ustring;
    _authorName: ustring;
    _message: ustring;
}
