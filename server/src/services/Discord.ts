import { ustring } from "../types/ustring";
import { AService } from "./AService";

export class Discord extends AService {
    //#region Contruction
    constructor() {
        super();
        // this._authorName = data.from.name
        // this._authorId = data.from.id;
        // this._message = data.content;
    }

    read(data: any): void {
        this._authorName = data.author;
        this._message = data.content;
    }

    receive(data: AService): void {
        this._authorName = data.getSmallText();
        this._message = data.getNormalText();
    }

    push(): void {
        // push to user-configured discord webhook
    }
    //#endregion

    //#region functions
    getSmallText(): ustring {
        return this._authorName;
    }
    getNormalText(): ustring {
        return this._message;
    }
    //#endregion

    //#region variables
    _authorName: ustring;
    _authorId: ustring;
    _message: ustring;
    //#endregion
}
