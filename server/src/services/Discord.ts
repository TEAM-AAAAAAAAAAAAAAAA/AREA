import { ustring } from "../types/ustring";
import { area } from "../area/.area";
import { IService } from "./IService";

@area.Service
export class Discord implements IService {
    read(data: any): void {
        this._authorName = data.author;
        this._message = data.content;
    }

@   area.Reaction
    postMessage(): void {
        console.log("discord");
    }

    _authorName: ustring;
    _message: ustring;
}
