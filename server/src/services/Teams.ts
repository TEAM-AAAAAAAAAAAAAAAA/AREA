import { ustring } from "../types/ustring";
import { MapPrismaReaction, MapPrismaService } from "../utils/mappings";
import { IService } from "./IService";

@MapPrismaService
export class Teams implements IService {
    read(data: any): void {
        this._authorId = data.from.id;
        this._authorName = data.from.name
        this._message = data?.text?.substring(data?.text?.indexOf(';') + 1, data?.text?.length - 1);
    }
    
    @MapPrismaReaction
    postMessage(): void
    {
        // push
        console.log(this._message);
        console.log("wait, that should be displayed on teams");
    }

    @MapPrismaReaction
    postMeeting(): void
    {
        console.log("meeting time")
        // push cool meeting embed
    }

    _authorId: ustring;
    _authorName: ustring;
    _message: ustring;
}
