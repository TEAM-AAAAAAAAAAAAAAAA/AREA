import { nstring, ustring } from "../types/string";
import { area } from "../area/.area";
import { IService } from "./IService";
import { Action, Description } from "../area/mappings";
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

@area.Service
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
        const htbUser = await getHTBUser(this._userId);
        if (!htbUser) return;

        const response = await htbRequest("profile/" + htbUser.providerUserId);

        const json = await response.json();

        this._message = json.profile.name + " is " + json.profile.rank + " on team " + json.profile.university_name + ".";
    }

    _userId: ustring;
    _message: ustring;
    _outgoing: nstring;
}
