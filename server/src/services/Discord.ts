import { nstring, ustring } from "../types/string";
import { area } from "../area/.area";
import { IService } from "./IService";

@area.Service
export class Discord implements IService {
    constructor() { this._outgoing = null; }

    read(data: any): void {
        this._authorName = data.author;
        this._message = data.content;
    }

    setOutgoing(data: nstring): void {
        this._outgoing = data;
    }

@   area.Reaction
    postMessage(): void {
        if (!this._outgoing) return;

        fetch(this._outgoing, {
            method: 'POST',
            body: JSON.stringify({content: this._message}),
            headers: {'Content-Type': 'application/json'} 
        }).then();
    }

    _authorName: ustring;
    _message: ustring;
    _outgoing: nstring;
}
