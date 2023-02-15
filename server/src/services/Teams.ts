import { nstring, ustring } from "../types/string";
import { area } from "../area/.area";
import { IService } from "./IService";
import * as AreaCards from '../utils/AreaCards';

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

    @area.Action
    postIssue(): void
    {
        if (!this._outgoing) return;

        fetch(this._outgoing, {
            method: 'POST',
            body: JSON.stringify(AreaCards.issueFormat("bill gates", "https://cdn.futura-sciences.com/cdn-cgi/image/width=1024,quality=60,format=auto/sources/images/scientist/persov6/Gates-1000.jpg", "Team-AAAAAAAAAAAAAAAA/AREA", 42, "Wow", "Very good code and project", "February 32, 2023")),
            headers: {'Content-Type': 'application/json'} 
        }).then();
    }

    // @area.Action
    // postTask(): void
    // {
    //     if (!this._outgoing) return;

    //     fetch(this._outgoing, {
    //         method: 'POST',
    //         body: JSON.stringify(
    //             {}
    //         ),
    //         headers: {'Content-Type': 'application/json'} 
    //     })
    // }

    _authorId: ustring;
    _authorName: ustring;
    _message: ustring;
    _outgoing: nstring;
}
