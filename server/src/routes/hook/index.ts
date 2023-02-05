import { Request, Response } from "express";
import { services } from "../../services/.services";
import { transcoders } from "../../transcoders/.transcoders";
import { prisma } from "../../config/db";
import { Action, Prisma, Reaction, Service, Webhook } from "@prisma/client";
import { mapPrismaReaction, mapPrismaService } from "../../utils/mappings";

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

async function runWebhook(webhook: Webhook) : Promise<boolean>
{

    let test: services.MagicDoNotTouch = new services.MagicDoNotTouch();
    test.start();

    let incomingReaction = await getReaction(webhook);
    if (!incomingReaction)
        return false;

    let incomingAction = await getAction(incomingReaction);
    if (!incomingAction)
        return false;

    let incomingService = await getService(incomingAction);
    if (!incomingService)
        return false;

    console.log(incomingAction.name)

    let service: any = mapPrismaService.get(incomingService.name);

    const reaction = mapPrismaReaction.get(incomingAction.name);
    if (reaction) {
        (function(f: Function) {
            f.apply(service, []);
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

        if (await runWebhook(webhook) != true)
            return res.status(500).json();

        return res.status(200).json();
    }]
};
