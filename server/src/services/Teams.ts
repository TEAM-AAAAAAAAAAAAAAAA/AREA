import { nstring, ustring } from "../types/string";
import { area } from "../area/.area";
import { IService } from "./IService";

@area.Service
export class Teams implements IService {
    constructor() { this._outgoing = null; }

    read(data: any): void {
        this._authorId = data?.from?.id;
        this._authorName = data?.from?.name
        this._message = data?.text?.substring(data?.text?.indexOf('</at> ') + 6);
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
        if (!this._outgoing) return;

        console.log(this._message);
        const dateNow = new Date(Date.now());
        const targetDate = new Date(this._year || dateNow.getFullYear(), this._month || dateNow.getMonth(), this._day || dateNow.getDate(), this._hour || dateNow.getHours(), this._minute || 0, 0, 0);


        fetch(this._outgoing, {
            method: 'POST',
            body: JSON.stringify({text: "New meeting created: " + this._message + " at " + targetDate.toLocaleString() + " by " + this._authorName}),
            headers: {'Content-Type': 'application/json'} 
        }).then();
    }

    _hour: number | undefined;
    _minute: number | undefined;
    _day: number | undefined;
    _month: number | undefined;
    _year: number | undefined;
    _authorId: ustring;
    _authorName: ustring;
    _message: ustring;
    _outgoing: nstring;
}
