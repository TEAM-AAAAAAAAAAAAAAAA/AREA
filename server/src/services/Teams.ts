import { ustring } from "../types/ustring";
import { AService } from "./AService";

export class Teams extends AService {
    //#region Contruction
    // constructor(data: any) {
    // super();
    // this._author = data?.author;
    // this._message = data?.text?.substring(data?.text?.indexOf(';') + 1, data?.text?.length - 1);
    // }
    constructor() {
        super();
    };

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
    //#endregion

    //#region Private members
    _authorId: ustring;
    _authorName: ustring;
    _message: ustring;
    //#endregion
}
