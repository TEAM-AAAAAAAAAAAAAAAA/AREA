import { nstring, ustring } from "../types/string";
import { area } from "../area/.area";
import { IService } from "./IService";
import { AuthProvider, Description } from "../area/mappings";
import { prisma } from "../config/db";
import moment, { Moment } from "moment";

interface DiscordListEmbed {
    "content": "AREA",
    "embeds": [DiscordListItem?],
    "attachments": []
}

export interface DiscordListItem {
    title: string;
    description: string;
    color: number;
    author: {
        name: string;
    }
    footer: {
        text: string;
    }
}

export interface DiscordList {
    list: DiscordListItem[];
}

@area.Service
@AuthProvider("discord")
export class Discord implements IService {
    constructor() { this._outgoing = null; }

    read(data: any): void {
        this._authorName = data.bot?.author;
        this._message = data.bot?.content;
        this._subject = data.bot?.subject;
        this._durationHours = data.bot?.duration_hours;
        this._durationMinutes = data.bot?.duration_minutes;
        this._startDateTime.year(data.bot?.year);
        this._startDateTime.month(data.bot?.month);
        this._startDateTime.subtract(1, 'month');
        this._startDateTime.date(data.bot?.day);
        this._startDateTime.hours(data.bot?.hour);
        this._startDateTime.minutes(data.bot?.minute || 0);        
        this._city = data.bot?.city;
        this._owner = data.bot?.owner;
        this._repo = data.bot?.repo;
        this._title = data.bot?.title;
        this._body = data.bot?.body;
        this._targetUser = data.bot?.targetUser;
        this._targetUserName = data.bot?.targetUserName;
    }

    setOutgoing(data: nstring): void {
        this._outgoing = data;
    }

    @area.Action
    @Description("Post a message to Discord")
    async postMessage(): Promise<void> {
        console.debug("Posting message to Discord: " + this._message);
        console.log(this._outgoing);
        if (!this._outgoing) return;

        await prisma.discordMessageQueue.create({
            data: {
                message: this._message || "",
                channelId: this._outgoing,
                embed: false
            }
        });
    }

    @area.Action
    @Description("Post a meeting to Discord")
    async postMeeting(): Promise<void> {
        const dateNow = new Date(Date.now());

        console.debug("Posting meeting to Discord");
        if (!this._outgoing) return;

        let body = JSON.stringify({
            "content": null,
            "embeds": [
                {
                "title": "New meeting",
                "description": this._subject,
                "color": 5814783,
                "fields": [
                    {
                    "name": "<t:" + Math.floor(this._startDateTime.unix()) + ":f>",
                    "value": "By " + this._authorName
                    }
                ]
                }
            ],
            "attachments": []
        });

        await prisma.discordMessageQueue.create({
            data: {
                message: body,
                channelId: this._outgoing,
                embed: true
            }
        });
    }

    @area.Action
    @Description("Post a list to Discord")
    async postList(): Promise<void> {
        console.debug("Posting list to Discord: " + this._message);
        console.log(this._outgoing);
        if (!this._outgoing) return;

        let embedList : DiscordListEmbed = { content: "AREA", embeds: [], attachments: [] };

        for (let item of this._list.list) {
            embedList.embeds.push({
                title: item.title,
                description: item.description,
                color: item.color,
                author: item.author,
                footer: item.footer
            });
            if (embedList.embeds.length >= 10)
                break;
        }

        console.log(JSON.stringify(embedList));

        await prisma.discordMessageQueue.create({
            data: {
                message: JSON.stringify(embedList),
                channelId: this._outgoing,
                embed: true
            }
        });
    }

    _list: DiscordList = { list: [] };
    _city: ustring;
    _startDateTime: Moment = moment();
    _durationHours: number = 0;
    _durationMinutes: number = 0;
    _authorName: ustring;
    _subject: ustring;
    _message: ustring;
    _targetUser: ustring;
    _targetUserName: ustring;
    _outgoing: nstring;
    _owner: ustring;
    _repo: ustring;
    _title: ustring;
    _body: ustring;

}
