import { Request, Response } from "express";
import { services } from "../../services/.services";
import { transcoders } from "../../transcoders/.transcoders";
import https from "https";
import fetch from "node-fetch-commonjs";
import passport from "passport";

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

export const hook = {

    GET: (req: Request, res: Response) => {
        res.status(200).send('got a hook');
    },

    POST: [
    // passport.authenticate('jwt', {session: false}),
    (req: any, res: Response) => {
        // check db to get corresponding webhook (we'll do some arbitrary if statements here to simulate it)
        let hook: string = req.params.hook;

        var msg: string = getMsgFromHook(hook, req);
        res.status(418).send();

        console.log(msg);
        console.log(msg.substring(hook.indexOf('</at>') + 6));
        // if (msg.substring(hook.indexOf('</at>') + 6).startsWith("teams ")) {
        //     msg = msg.substring(hook.indexOf('</at>') + 6);
        //     fetchOutgoingWebhook("text", msg, "https://epitechfr.webhook.office.com/webhookb2/5f4e8902-8b88-4418-9642-a994d3d14def@901cb4ca-b862-4029-9306-e5cd0f6d9f86/IncomingWebhook/d527c0c6eb5147319511db409a232808/dd5866dd-b491-4a87-bcd1-c59d6742bebb");
        // } else if (msg.startsWith("discord ")) {
        //     msg = msg.substring(8);
        //     fetchOutgoingWebhook("content", msg, "https://discord.com/api/webhooks/1063747203098738779/D150PoHwflKTJX47ew80J4x2U49VTAcF3hKSjL1XTK9I7pi1yOiHiwcferLTHNSVwcED");
        // };

        // Will be replaced by a database call
        if (hook.startsWith("discord")) {
            // let inputService: services.Discord = new services.Discord(req.body);
            let inputService: services.Discord = new services.Discord();
            inputService.read(req.body);
            let outputService: services.Teams = transcoders.discordToTeams(inputService);
        }
    }]
};
