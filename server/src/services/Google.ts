import { nstring, ustring } from "../types/string";
import { area } from "../area/.area";
import { IService } from "./IService";
import { Action, Description } from "../area/mappings";
import { google } from "googleapis";
import { prisma } from "../config/db";
import moment, { Moment } from "moment";
import { OAuth2Client } from "google-auth-library";

async function getOAuth2Client(userId: string) : Promise<OAuth2Client | undefined> {
    const prismaUserGoogle = await prisma.oAuthUserData.findUnique({
        where: {
            userId_oAuthProviderName: {
                userId: userId,
                oAuthProviderName: "google"
            }
        }
    });
    if (!prismaUserGoogle) return undefined;

    const oauth2Client = new google.auth.OAuth2(
        {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            redirectUri: process.env.GOOGLE_REDIRECT_URI
        }
    );

    oauth2Client.setCredentials({
        access_token: prismaUserGoogle?.accessToken
        refresh_token: prismaUserGoogle?.refreshToken
    });

    return oauth2Client;
}

@area.Service
export class Google implements IService {
    constructor() { this._outgoing = null; }

    read(data: any): void {
    }

    setOutgoing(data: nstring): void {
        this._outgoing = data;
    }
    
    @Action
    @Description("Post an event to google calendar")
    async postCalendarEvent(): Promise<void>
    {
        if (!this._userId) return;

        let oauth2Client = await getOAuth2Client(this._userId);
        if (!oauth2Client) return;

        const calendar = google.calendar({
            version: 'v3',
            auth: oauth2Client
        })

        let endDate = moment(this._startDateTime);
        endDate.add(this._durationHours, 'hours');
        endDate.add(this._durationMinutes, 'minutes');

        calendar.events.insert({
            auth: oauth2Client,
            calendarId: 'primary',
            sendNotifications: true,
            requestBody: {
                summary: this._summary,
                location: this._location,
                description: this._description,
                start: {
                    dateTime: this._startDateTime.toISOString(),
                    timeZone: 'Etc/UTC',
                },
                end: {
                    dateTime: endDate.toISOString(),
                    timeZone: 'Etc/UTC',
                },
            }
        }, function(err, event) {
            if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                return;
            }
            console.log('Event created: %s', event?.data.htmlLink);
        });
    }

    _summary: ustring;
    _location: ustring;
    _description: ustring;
    _startDateTime: Moment = moment();
    _durationHours: number = 0;
    _durationMinutes: number = 0;
    _userId: ustring;
    _outgoing: nstring;
}
