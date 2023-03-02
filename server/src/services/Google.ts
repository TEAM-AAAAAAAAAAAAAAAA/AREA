import { nstring, ustring } from "../types/string";
import { area } from "../area/.area";
import { IService } from "./IService";
import { Action, Description } from "../area/mappings";
import { google } from "googleapis";
import { prisma } from "../config/db";

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
        if (!this._outgoing) return;

        // const calendar = google.calendar({version: 'v3', auth: process.env.GOOGLE_API_KEY});

        const oauth2Client = new google.auth.OAuth2(
            {
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                redirectUri: process.env.GOOGLE_REDIRECT_URI
            }
        );

        if (!this._userId) return;

        const prismaUserGoogle = await prisma.oAuthUserData.findUnique({
            where: {
                userId_oAuthProviderName: {
                    userId: this._userId,
                    oAuthProviderName: "google"
                }
            }
        });

        oauth2Client.setCredentials({
            access_token: prismaUserGoogle?.accessToken,
            refresh_token: prismaUserGoogle?.refreshToken,
            scope: 'https://www.googleapis.com/auth/calendar',
        });

        const calendar = google.calendar({
            version: 'v3',
            auth: oauth2Client
        })

        console.log(await calendar.events.list())

        calendar.events.insert({
            auth: oauth2Client,
            calendarId: 'primary',
            sendNotifications: true,
            requestBody: {
                summary: this._summary,
                location: this._location,
                description: this._description,
                start: {
                    date: this._startDateTime,
                    timeZone: 'UTC',
                },
                end: {
                    date: this._endDateTime,
                    timeZone: 'UTC',
                },
            }
        }, function(err, event) {
            if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                return;
            }
            console.log('Event created: %s', event?.data.htmlLink);
        });

        // const request = calendar.events.insert({
        //     'calendarId': 'primary',
        //     'resource': event
        // });
        

        // const { token } = await oauth2Client.getToken(code);

        // const auth = new google.auth.GoogleAuth({
        //     authClient: new google.auth.OAuth2(
        //         {

        //         }
        //         process.env.GOOGLE_CLIENT_ID,
        //         process.env.GOOGLE_CLIENT_SECRET,
        //     )
        // });

        // fetch(this._outgoing, {
        //     method: 'POST',
        //     body: JSON.stringify({text: this._message}),
        //     headers: {'Content-Type': 'application/json'} 
        // }).catch(e => console.error(e));
        
    }

    _summary: ustring;
    _location: ustring;
    _description: ustring;
    _startDateTime: ustring;
    _endDateTime: ustring;
    _userId: ustring;
    _outgoing: nstring;
}
