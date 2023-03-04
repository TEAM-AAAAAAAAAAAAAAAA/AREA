import { nstring, ustring } from "../types/string";
import { area } from "../area/.area";
import { IService } from "./IService";
import { Action, AuthProvider, Description, Service } from "../area/mappings";
import { prisma } from "../config/db";
import moment, { Moment } from "moment";
import { oAuthUserData } from "@prisma/client";

async function htbRequest(route: string)
{
    return await fetch("https://www.hackthebox.eu/api/v4/" + route, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + process.env.HTB_TOKEN,
        }
    });
}

async function getHTBUser(userId: ustring) : Promise<oAuthUserData | undefined>
{
    if (!userId) return undefined;

    const prismaUserHTB = await prisma.oAuthUserData.findUnique({
        where: {
            userId_oAuthProviderName: {
                userId: userId,
                oAuthProviderName: "hackthebox"
            }
        }
    });
    if (!prismaUserHTB) return undefined;

    return prismaUserHTB;
}

/**
 * HackTheBox service
 * 
 * This one's a bit special, it is not intended to push data to any webhook or api but rather to be read by other services using chained reactions.
 */
@Service
@AuthProvider("hackthebox")
export class HackTheBox implements IService {
    constructor() { this._outgoing = null; }

    read(data: any): void {
    }

    setOutgoing(data: nstring): void {
        this._outgoing = data;
    }
    
    @Action
    @Description("Get my profile.")
    async getProfile(): Promise<void>
    {
        console.log(this._userId, this._targetUser)
        const htbUser = await getHTBUser(this._targetUser || this._userId);
        if (!htbUser) return;

        const response = await htbRequest("profile/" + htbUser.providerUserId);

        const json = await response.json();

        this._message = json.profile.name + " is " + json.profile.rank + " on team " + json.profile.university_name + ".";
    }
    
    @Action
    @Description("Get my progress.")
    async getOSProgress(): Promise<void>
    {
        console.log(this._userId, this._targetUser)
        const htbUser = await getHTBUser(this._targetUser || this._userId);
        if (!htbUser) return;

        const response = await htbRequest("profile/progress/machines/os/" + htbUser.providerUserId);

        const json = await response.json();

        this._message = this._targetUserName + " has\n";
        for (const os of json.profile.operating_systems) {
            this._message += os.owned_machines + "/" + os.total_machines + " (" + os.completion_percentage + "%) for " + os.name + "\n";
        }
    }

    _userId: ustring;
    _message: ustring;
    _targetUser: ustring;
    _targetUserName: ustring;
    _outgoing: nstring;
}
