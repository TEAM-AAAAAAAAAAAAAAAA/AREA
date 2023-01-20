import { IService } from "../IService";

export class Discord implements IService {
    //#region Contruction
    constructor(data: any) {
        this._author = data.author;
        this._message = data.content;
    }

    public read(data: any): void {
        this._author = data.author;
        this._message = data.content;
    }

    public receive(data: IService): void {
        this._author = data.getSmallText();
        this._message = data.getNormalText();
    }
    //#endregion

    //#region Public members
    public getSmallText(): string {
        return this._author;
    }
    public getNormalText(): string {
        return this._message;
    }
    public getBigText(): string {
        return "";
    }
    //#endregion

    //#region Private members
    private _author: string;
    private _message: string;
    //#endregion
}
