import { nstring, ustring } from "../types/string";
import { area } from "../area/.area";
import { IService } from "./IService";

@area.Service
export class Teams implements IService {
    constructor() { this._outgoing = null; }

    read(data: any): void {
        this._authorId = data?.from?.id;
        this._authorName = data?.from?.name
        this._message = data?.text?.substring(data?.text?.indexOf(';') + 1, data?.text?.length - 1);
    }

    setOutgoing(data: nstring): void {
        this._outgoing = data;
    }
    
    @area.Action
    postMessage(): void
    {
        if (!this._outgoing) return;

        fetch(this._outgoing, {
            method: 'POST',
            body: JSON.stringify({text: this._message}),
            headers: {'Content-Type': 'application/json'} 
        }).then();
        
    }

    @area.Action
    postMeeting(): void
    {
        console.log("meeting time")
        // push cool meeting embed
    }

    _authorId: ustring;
    _authorName: ustring;
    _message: ustring;
    _outgoing: nstring;
}
