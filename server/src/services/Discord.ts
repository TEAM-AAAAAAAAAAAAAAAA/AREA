import { ustring } from "../types/ustring";
import { IService } from "./IService";

export class Discord implements IService {
    read(data: any): void {
        this._authorName = data.author;
        this._message = data.content;
    }

    // receive(data: AService): void {
    //     this._authorName = data.getSmallText();
    //     this._message = data.getNormalText();
    // }

    push(): void {
        // push to user-configured discord webhook
    }
    //#endregion

    getAuthorName(): ustring {
        return this._authorName;
    }

    getAuthorId(): ustring {
        return this._authorId;
    }

    getNormalText(): ustring {
        return this._message;
    }

    _authorName: ustring;
    _authorId: ustring;
    _message: ustring;
}
