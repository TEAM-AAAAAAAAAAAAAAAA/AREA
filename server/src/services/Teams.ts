import { AService, ustring } from "./AService";

export class Teams extends AService {
    //#region Contruction
    constructor(data: any) {
        super();
        this._author = data.author;
        this._message = data.text.substring(data.text.indexOf(';') + 1, data.text.length - 1);
    }

    public read(data: any): void {
        this._author = data.author;
        this._author = data.author;
        this._message = data.content;
    }

    public receive(data: AService): void {
        this._author = data.getAuthorId();
        this._author = data.getSmallText();
        this._message = data.getNormalText();
    }

    public push(): void {
        // push to user-configured teams webhook
    }
    //#endregion

    //#region Private members
    private _author: ustring;
    private _message: ustring;
    //#endregion
}
