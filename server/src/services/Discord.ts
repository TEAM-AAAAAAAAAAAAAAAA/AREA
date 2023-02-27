import { nstring, ustring } from "../types/string";
import { area } from "../area/.area";
import { IService } from "./IService";

@area.Service
export class Discord implements IService {
    constructor() { this._outgoing = null; }

    read(data: any): void {
      this._authorName = data.bot?.author;
      this._message = data.bot?.content;
      this._subject = data.bot?.subject;
      this._hour = data.bot?.hour;
      this._minute = data.bot?.minute;
      this._day = data.bot?.day;
      this._month = data.bot?.month;
      this._year = data.bot?.year;
      this._city = data.bot?.city;
    }

    setOutgoing(data: nstring): void {
        this._outgoing = data;
    }

    @area.Action
    postMessage(): void {
        console.debug("Posting message to Discord: " + this._message);
        if (!this._outgoing) return;

        fetch(this._outgoing, {
            method: 'POST',
            body: JSON.stringify({content: this._message}),
            headers: {'Content-Type': 'application/json'}
        }).then();
    }

    @area.Action
    postMeeting(): void {
        const dateNow = new Date(Date.now());
        const targetDate = new Date(this._year || dateNow.getFullYear(), this._month || dateNow.getMonth(), this._day || dateNow.getDate(), this._hour || dateNow.getHours(), this._minute || 0, 0, 0);

        console.debug("Posting meeting to Discord");
        if (!this._outgoing) return;

        fetch(this._outgoing, {
            method: 'POST',
            body: JSON.stringify({
                "content": null,
                "embeds": [
                  {
                    "title": "New meeting",
                    "description": this._subject,
                    "color": 5814783,
                    "fields": [
                      {
                        "name": "<t:" + Math.floor(targetDate.getTime() / 1000) + ":f>",
                        "value": "By " + this._authorName
                      }
                    ]
                  }
                ],
                "attachments": []
              }),
            headers: {'Content-Type': 'application/json'} 
        }).then();
    }

    @area.Action
    dataCollector(): void {}

    _city: ustring;
    _hour: number | undefined;
    _minute: number | undefined;
    _day: number | undefined;
    _month: number | undefined;
    _year: number | undefined;
    _authorName: ustring;
    _subject: ustring;
    _message: ustring;
    _outgoing: nstring;
}
