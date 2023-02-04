import { ustring } from "../types/ustring";
import { IService } from "./IService";

export class Discord implements IService {
    read(data: any): void {
        this._authorName = data.author;
        this._message = data.content;
    }

    getAuthorName(): ustring {
        return this._authorName;
    }

    getMessage(): ustring {
        return this._message;
    }

    _authorName: ustring;
    _message: ustring;
}
