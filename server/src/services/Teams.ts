import { ustring } from "../types/ustring";
import { IService } from "./IService";

export class Teams implements IService {
    read(data: any): void {
        this._authorId = data.from.id;
        this._authorName = data.from.name
        this._message = data?.text?.substring(data?.text?.indexOf(';') + 1, data?.text?.length - 1);
    }

    getAuthorName(): ustring {
        return this._authorName;
    }

    getAuthorId(): ustring {
        return this._authorId;
    }

    getMessage(): ustring {
        return this._message;
    }

    _authorId: ustring;
    _authorName: ustring;
    _message: ustring;
}
