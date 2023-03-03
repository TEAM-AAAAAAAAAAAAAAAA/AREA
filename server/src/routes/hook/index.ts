import { Request, Response } from "express";
import { transcoders } from "../../transcoders/transcoders";
import { prisma } from "../../config/db";
import { Action, ActionReaction, React, Reaction, Service, Webhook } from "@prisma/client";
import { PrismaActions, PrismaServices, Transcoders } from "../../area/mappings";
import { IService } from "../../services/IService";

async function getReaction(webhook: Webhook) : Promise<Reaction | null>
{
    return prisma.reaction.findUnique({
        where: {
            reactionId: webhook.reactionId
        }
    });
}

async function getReact(reaction: Reaction) : Promise<React | null>
{
    return prisma.react.findUnique({
        where: {
            serviceName_reactionName: { 
                serviceName: reaction.serviceName,
                reactionName: reaction.reactionName
            },
        }
    });
}

async function getService(action: React) : Promise<Service | null>
{
    return prisma.service.findUnique({
        where: {
            serviceName: action.serviceName,
        }
    });
}

function transcodeService(reaction: Reaction, parentService: IService) : IService | undefined
{
    if (parentService.constructor.name != reaction.serviceName) {
        let transcoder = Transcoders.get(parentService.constructor.name + '.' + reaction.serviceName);
        if (!transcoder) {
            console.log("no transcoder found");
            return undefined;
        }
        return (function(f: Function) {
            return (f.apply(transcoders, [parentService]));
        })(transcoder);
    } else {
        console.log("no transcoder needed (same service)");
    }
    return parentService;
}

async function runChained(reaction: Reaction, parentService: IService, incomingServiceName: string)
{
    let areas: ActionReaction[] = await prisma.actionReaction.findMany({
        where: {
            actionId: reaction.reactionId,
        }
    });

    areas.forEach(async next => {
        let newReact = await prisma.reaction.findUnique({
            where: { reactionId: next.reactionId }
        });
        if (!newReact)
            return;

        runReaction(newReact, parentService, incomingServiceName);
    });
}

async function runReaction(reaction: Reaction, service: IService, incomingServiceName: string) : Promise<boolean>
{
    let outgoingAction = await getReact(reaction);
    if (!outgoingAction)
        return false;

    let newService = transcodeService(reaction, service);
    if (!newService)
        return false;

    newService.setOutgoing(reaction.outgoingWebhook);
    const action = PrismaActions.get(outgoingAction.serviceName + '.' + outgoingAction.reactionName);
    if (action) {
        await (async function(f: Function) {
            await f.apply(newService, []);
        })(action);
        runChained(reaction, newService, reaction.serviceName);
        return true;
    }

    return false;
}

async function runWebhook(webhook: Webhook, requestBody: any) : Promise<boolean>
{
    let outgoingReaction = await getReaction(webhook);
    if (!outgoingReaction)
        return false;
    
    if (!outgoingReaction.enabled)
        return false;

    let outgoingReact = await getReact(outgoingReaction);
    if (!outgoingReact)
        return false;

    let outgoingService = await getService(outgoingReact);
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

    return await runReaction(outgoingReaction, serviceInstance, webhook.incomingServiceName);
}

export const hook = {

    GET: (req: Request, res: Response) => {
        res.status(200).json('got a hook');
    },

    POST: [
    async (req: any, res: Response) => {
        try {
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
                return res.status(404).json({text: "hook not found"});

            if (await runWebhook(webhook, req.body) != true)
                return res.status(500).json({text: "failed to run hook"});

            return res.status(200).json({text: "ok"});
        } catch (e: any) {
            console.log(e.message);
            return res.status(500).json({text: "ko"});
        }
    }]
};
