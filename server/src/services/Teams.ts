import { ustring } from "../types/ustring";
import { AService } from "./AService";

export class Teams extends AService {
    read(data: any): void {
        this._authorId = data.from.id;
        this._authorName = data.from.name
        this._message = data?.text?.substring(data?.text?.indexOf(';') + 1, data?.text?.length - 1);
    }

    // receive(data: AService): void {
    //     this._authorId = data.getAuthorId();
    //     this._authorName = data.getSmallText();
    //     this._message = data.getNormalText();
    // }

    push(): void {
        // push to user-configured teams webhook
    }

    getAuthorName(): ustring {
        return this._authorName;
    }

    getAuthorId(): ustring {
        return this._authorId;
    }

    getNormalText(): ustring {
        return this._message;
    }

    _authorId: ustring;
    _authorName: ustring;
    _message: ustring;
}