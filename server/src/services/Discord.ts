import { AService, ustring } from "./AService";

export class Discord extends AService {
    //#region Contruction
    constructor(data: any) {
        super();
        this._authorName = data.from.name
        this._authorId = data.from.id;
        this._message = data.content;
    }

    public read(data: any): void {
        this._authorName = data.author;
        this._message = data.content;
    }

    public receive(data: AService): void {
        this._authorName = data.getSmallText();
        this._message = data.getNormalText();
    }

    public push(): void {
        // push to user-configured discord webhook
    }
    //#endregion

    //#region Public members
    public getSmallText(): ustring {
        return this._authorName;
    }
    public getNormalText(): ustring {
        return this._message;
    }
    //#endregion

    //#region Private members
    private _authorName: ustring;
    private _authorId: ustring;
    private _message: ustring;
    //#endregion
}
