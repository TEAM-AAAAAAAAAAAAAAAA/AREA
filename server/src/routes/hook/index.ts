import { Request, Response } from "express";
import { reactions } from '../../reactions/.reactions'
import { services } from "../../services/.services";
import { transcoders } from "../../transcoders/.transcoders";
import https from "https";
import fetch from "node-fetch-commonjs";
import { prisma } from "../../config/db";
import { Prisma, Webhook } from "@prisma/client";

function getMsgFromHook(hook: string, req: any) {
    var msg: string = "";
    if (hook.startsWith("teams")) {
        msg = req.body.text;
        msg = msg.substring(msg.indexOf(';') + 1);
        return msg;
    } else if (hook.startsWith("discord")) {
        return req.body.content;
    } else {
        return "";
    }
}

function fetchOutgoingWebhook(textKey: string, msg: string, webhookUrl: string) {
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [textKey]: msg })
    });
}

function runWebhook(webhook: Webhook | null) : boolean
{
    console.log(webhook)

    return true;
}

export const hook = {

    GET: (req: Request, res: Response) => {
        res.status(200).json('got a hook');
    },

    POST: [
    async (req: any, res: Response) => {
        let hook: string = req.params.hook;
        if (hook.indexOf('/') != hook.lastIndexOf('/'))
            return res.status(400).json();

        let hookUser: string = hook.substring(0, hook.indexOf('/'))
        let hookId: string = hook.substring(hook.indexOf('/') + 1)
        if (!(hookUser != null && hookUser != "" && hookId != null && hookId != ""))
            return res.status(400).json();
        
        console.log(hookUser)
        console.log(hookId)

        let webhook: Webhook | null = await prisma.webhook.findFirst({
            where: {
                id: hookId,
                userId: hookUser
            }
        });

        if (!webhook)
            return res.status(404).json();

        if (runWebhook(webhook) != true)
            return res.status(500).json();

        return res.status(200).json();
    }]
};
