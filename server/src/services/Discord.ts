import { nstring, ustring } from "../types/string";
import { area } from "../area/.area";
import { IService } from "./IService";
import { Description } from "../area/mappings";
import { prisma } from "../config/db";

interface DiscordListEmbed {
    "content": "Weather forecast",
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
        const targetDate = new Date(this._year || dateNow.getFullYear(), this._month || dateNow.getMonth(), this._day || dateNow.getDate(), this._hour || dateNow.getHours(), this._minute || 0, 0, 0);

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
                    "name": "<t:" + Math.floor(targetDate.getTime() / 1000) + ":f>",
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

        let embedList : DiscordListEmbed = { content: "Weather forecast", embeds: [], attachments: [] };

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
