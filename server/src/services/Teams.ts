import { nstring, ustring } from "../types/string";
import { area } from "../area/.area";
import { IService } from "./IService";
import * as AreaCards from '../utils/AreaCards';
import { Action, Description } from "../area/mappings";

@area.Service
export class Teams implements IService {
    constructor() { this._outgoing = null; }

    read(data: any): void {
        this._authorId = data?.from?.id;
        this._authorName = data?.from?.name
        this._message = data?.text?.substring(data?.text?.indexOf('</at>') + 5).replace("&nbsp;", " ");
        this._title = this._message;
        this._datetime = new Date(data?.timestamp);
        
        if (this._message)
        {
            let dateFormatRegex = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}) (.+)/g; // ex: 2022-02-21 14:30 r-Thai meeting
            let tryParseDate = dateFormatRegex.exec(this._message);

            if (tryParseDate)
            {
                this._year = parseInt(tryParseDate[1]);
                this._month = parseInt(tryParseDate[2]) - 1;
                this._day = parseInt(tryParseDate[3]);
                this._hour = parseInt(tryParseDate[4]);
                this._minute = parseInt(tryParseDate[5]);
                this._subject = tryParseDate[6];
            }
        }
        // this._message = data?.text?.replace("<at>", "").replace("</at>", "").replace("&nbsp;", " ");
    }

    setOutgoing(data: nstring): void {
        this._outgoing = data;
    }
    
    @Action
    @Description("Post a message to Teams")
    postMessage(): void
    {
        if (!this._outgoing) return;

        fetch(this._outgoing, {
            method: 'POST',
            body: JSON.stringify({text: this._message}),
            headers: {'Content-Type': 'application/json'} 
        }).catch(e => console.error(e));
        
    }

    @Action
    @Description("Post a meeting to Teams")
    postMeeting(): void
    {
        if (!this._outgoing) return;

        console.log(this._message);
        const dateNow = new Date(Date.now());
        const targetDate = new Date(this._year || dateNow.getFullYear(), this._month || dateNow.getMonth(), this._day || dateNow.getDate(), this._hour || dateNow.getHours(), this._minute || 0, 0, 0);


        fetch(this._outgoing, {
            method: 'POST',
            body: JSON.stringify({text: "New meeting created: " + this._subject + " at " + targetDate.toLocaleString() + " by " + this._authorName}),
            headers: {'Content-Type': 'application/json'} 
        }).catch(e => console.error(e));
    }

    @Action
    @Description("A cool way to post an issue to Teams using adaptive cards")
    postIssue(): void
    {
        if (!this._outgoing) return;

        fetch(this._outgoing, {
            method: 'POST',
            body: JSON.stringify(AreaCards.issueFormat(this._authorName, this._authorImage, this._repository, this._repositoryLink, this._issueId, this._issue, this._issueLink, this._message, this._datetime)),
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

    _hour: number | undefined;
    _minute: number | undefined;
    _day: number | undefined;
    _month: number | undefined;
    _year: number | undefined;
    _authorId: ustring;
    _authorName: ustring;
    _authorImage: ustring;
    _title: ustring;
    _datetime: Date | undefined = new Date(Date.now());
    _message: ustring;
    _subject: ustring;
    _repository: ustring;
    _repositoryLink: ustring;
    _issue: ustring;
    _issueId: number | undefined;
    _issueLink: ustring;
    _outgoing: nstring;
}
