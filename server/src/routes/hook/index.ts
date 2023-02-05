import { Request, Response } from "express";
import { services } from "../../services/.services";
import { transcoders } from "../../transcoders/transcoders";
import { prisma } from "../../config/db";
import { Action, Prisma, Reaction, Service, Webhook } from "@prisma/client";
import { PrismaReactions, mapPrismaServices, mapTranscoders } from "../../area/mappings";
import { IService } from "../../services/IService";

async function getReaction(webhook: Webhook) : Promise<Reaction | null>
{
    return prisma.reaction.findFirst({
        where: {
            id: webhook.reactionId
        }
    });
}

async function getAction(reaction: Reaction) : Promise<Action | null>
{
    return prisma.action.findFirst({
        where: {
            id: reaction.actionId
        }
    });
}

async function getService(action: Action) : Promise<Service | null>
{
    return prisma.service.findFirst({
        where: {
            id: action.serviceId
        }
    });
}

// async function getOutgoing(webhook: Webhook) : Promise<Service | null>
// {
//     let outgoingReaction = await getReaction(webhook);
//     if (!outgoingReaction)
//         return null;

//     let outgoingAction = await getAction(outgoingReaction);
//     if (!outgoingAction)
//         return null;

//     let outgoingService = await getService(outgoingAction);
//     if (!outgoingService)
//         return null;

//     console.log(outgoingAction.name)
//     return outgoingService;
// }

async function runWebhook(webhook: Webhook, requestBody: any) : Promise<boolean>
{
    let magic: services.MagicDoNotTouch = new services.MagicDoNotTouch();
    magic.start();

    let outgoingReaction = await getReaction(webhook);
    if (!outgoingReaction)
        return false;

    let outgoingAction = await getAction(outgoingReaction);
    if (!outgoingAction)
        return false;

    let outgoingService = await getService(outgoingAction);
    if (!outgoingService)
        return false;

    let incomingService = await prisma.service.findFirst({
        where: {
            id: webhook.serviceId
        }
    });
    if (!incomingService)
        return false;

    let serviceReturn = mapPrismaServices.get(incomingService.name);
    if (!serviceReturn)
        return false;
    let serviceInstance = new serviceReturn();
    serviceInstance.read(requestBody);
    
    if (serviceInstance.constructor.name != outgoingService.name) {
        let transcoder = mapTranscoders.get(serviceInstance.constructor.name + '.' + outgoingService.name);
        if (!transcoder) {
            console.log("no transcoder found");
            return false;
        }
        console.log(transcoder);
        (function(f: Function) {
            serviceInstance = (f.apply(transcoders, [serviceInstance]));
        })(transcoder);
    }
    
    serviceInstance.setOutgoing(outgoingReaction.outgoingWebhook);
    const reaction = PrismaReactions.get(outgoingAction.name);
    if (reaction) {
        (function(f: Function) {
            f.apply(serviceInstance, []);
        })(reaction);
        return true;
    }
    return false;
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
        
        let webhook: Webhook | null = await prisma.webhook.findFirst({
            where: {
                id: hookId,
                userId: hookUser
            }
        });

        if (!webhook)
            return res.status(404).json();

        if (await runWebhook(webhook, req.body) != true)
            return res.status(500).json();

        return res.status(200).json();
    }]
};
