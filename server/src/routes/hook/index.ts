import { Request, Response } from "express";
import { transcoders } from "../../transcoders/transcoders";
import { prisma } from "../../config/db";
import { Action, Reaction, Service, Webhook } from "@prisma/client";
import { PrismaActions, PrismaServices, Transcoders } from "../../area/mappings";

async function getReaction(webhook: Webhook) : Promise<Reaction | null>
{
    return prisma.reaction.findUnique({
        where: {
            reactionId: webhook.reactionId
        }
    });
}

async function getAction(reaction: Reaction) : Promise<Action | null>
{
    return prisma.action.findUnique({
        where: {
            serviceName_actionName: { 
                serviceName: reaction.serviceName,
                actionName: reaction.actionName
            },
        }
    });
}

async function getService(action: Action) : Promise<Service | null>
{
    return prisma.service.findUnique({
        where: {
            serviceName: action.serviceName,
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
    let outgoingReaction = await getReaction(webhook);
    if (!outgoingReaction)
        return false;
    
    if (!outgoingReaction.enabled)
        return false;

    let outgoingAction = await getAction(outgoingReaction);
    if (!outgoingAction)
        return false;

    let outgoingService = await getService(outgoingAction);
    if (!outgoingService)
        return false;

    let incomingService = await prisma.service.findFirst({
        where: {
            serviceName: webhook.incomingServiceName
        }
    });
    if (!incomingService)
        return false;

    let serviceReturn = PrismaServices.get(incomingService.serviceName);
    if (!serviceReturn)
        return false;
    let serviceInstance = new serviceReturn();
    serviceInstance.read(requestBody);
    
    if (serviceInstance.constructor.name != outgoingService.serviceName) {
        let transcoder = Transcoders.get(serviceInstance.constructor.name + '.' + outgoingService.serviceName);
        if (!transcoder) {
            console.log("no transcoder found");
            return false;
        }
        console.log(transcoder);
        (function(f: Function) {
            serviceInstance = (f.apply(transcoders, [serviceInstance]));
        })(transcoder);
    } else {
        console.log("no transcoder needed (same service)");
    }
    
    serviceInstance.setOutgoing(outgoingReaction.outgoingWebhook);
    const reaction = PrismaActions.get(outgoingAction.serviceName + '.' + outgoingAction.actionName);
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
                webhookId: hookId,
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
