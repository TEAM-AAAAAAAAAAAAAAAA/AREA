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

// async function getOutgoing(webhook: Webhook) : Promise<Service | null>
// {
//     let outgoingReaction = await getReaction(webhook);
//     if (!outgoingReaction)
//         return null;

//     let outgoingAction = await getReact(outgoingReaction);
//     if (!outgoingAction)
//         return null;

//     let outgoingService = await getService(outgoingAction);
//     if (!outgoingService)
//         return null;

//     console.log(outgoingAction.name)
//     return outgoingService;
// }

// async function react(outgoingReaction: Reaction, parentServiceName: string, parentService: IService | undefined) : Promise<IService | undefined> {
//     if (!outgoingReaction.enabled)
//         return undefined;

//     let outgoingAction = await getReact(outgoingReaction);
//     if (!outgoingAction)
//         return undefined;

//     let outgoingService = await getService(outgoingAction);
//     if (!outgoingService)
//         return undefined;

//     let incomingService = await prisma.service.findFirst({
//         where: {
//             serviceName: parentServiceName
//         }
//     });
//     if (!incomingService)
//         return undefined;


//     let serviceReturn = PrismaServices.get(incomingService.serviceName);
//     if (!serviceReturn)
//         return undefined;
//     let serviceInstance = new serviceReturn();
    
//     if (serviceInstance.constructor.name != outgoingService.serviceName) {
//         let transcoder = Transcoders.get(serviceInstance.constructor.name + '.' + outgoingService.serviceName);
//         if (!transcoder) {
//             console.log("no transcoder found");
//             return undefined;
//         }
//         console.log(transcoder);
//         (function(f: Function) {
//             serviceInstance = (f.apply(transcoders, [parentService]));
//         })(transcoder);
//     } else {
//         console.log("no transcoder needed (same service)");
//     }
    
//     serviceInstance.setOutgoing(outgoingReaction.outgoingWebhook);
//     const reaction = PrismaActions.get(outgoingAction.serviceName + '.' + outgoingAction.reactionName);
//     if (reaction) {
//         (function(f: Function) {
//             f.apply(serviceInstance, []);
//         })(reaction);
//         // if (outgoingReaction.enabledChain) {
//         //     await actionReaction(outgoingReaction);
//         // }
//         return serviceInstance;
//     }

//     return undefined;
// }

// async function actionReaction(action: Reaction, parentService: IService | undefined)
// {
//     // console.log(action.reactionId)
//     let areas: ActionReaction[] = await prisma.actionReaction.findMany({
//         where: {
//             actionId: action.reactionId,
//         }
//     });

//     areas.forEach(async element => {
//         let newReaction: Reaction | null = await prisma.reaction.findUnique({
//             where: {
//                 reactionId: element.reactionId,
//             }
//         })
//         if (newReaction) {
//             parentService = await react(newReaction, action.serviceName, parentService);

//             if (await parentService)
//                 await actionReaction(newReaction, parentService);
//         }
//     });
// }

async function runReaction(reaction: Reaction, service: IService) : Promise<boolean>
{
    let outgoingAction = await getReact(reaction);
    if (!outgoingAction)
        return false;

    let outgoingService = await getService(outgoingAction);
    if (!outgoingService)
        return false;

    service.setOutgoing(reaction.outgoingWebhook);
    const action = PrismaActions.get(outgoingAction.serviceName + '.' + outgoingAction.reactionName);
    if (action) {
        (function(f: Function) {
            f.apply(service, []);
        })(action);
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

    return await runReaction(outgoingReaction, serviceInstance);

    // let serviceReturn = PrismaServices.get(await getService(getReact(outgoingReaction)).then(();
    // if (!serviceReturn)
    //     return false;
    // let serviceInstance = new serviceReturn();
    // serviceInstance.read(requestBody);

    // let outgoingAction = await getReact(outgoingReaction);
    // if (!outgoingAction)
    //     return false;

    // let outgoingService = await getService(outgoingAction);
    // if (!outgoingService)
    //     return false;

    // let incomingService = await prisma.service.findFirst({
    //     where: {
    //         serviceName: webhook.incomingServiceName
    //     }
    // });
    // if (!incomingService)
    //     return false;

    // let serviceReturn = PrismaServices.get(incomingService.serviceName);
    // if (!serviceReturn)
    //     return false;
    // let serviceInstance = new serviceReturn();
    // serviceInstance.read(requestBody);
    
    // if (serviceInstance.constructor.name != outgoingService.serviceName) {
    //     let transcoder = Transcoders.get(serviceInstance.constructor.name + '.' + outgoingService.serviceName);
    //     if (!transcoder) {
    //         console.log("no transcoder found");
    //         return false;
    //     }
    //     console.log(transcoder);
    //     (function(f: Function) {
    //         serviceInstance = (f.apply(transcoders, [serviceInstance]));
    //     })(transcoder);
    // } else {
    //     console.log("no transcoder needed (same service)");
    // }
    
    // serviceInstance.setOutgoing(outgoingReaction.outgoingWebhook);
    // const reaction = PrismaActions.get(outgoingAction.serviceName + '.' + outgoingAction.reactionName);
    // if (reaction) {
    //     (function(f: Function) {
    //         f.apply(serviceInstance, []);
    //     })(reaction);
    //     // if (outgoingReaction.enabledChain) {
    //     //     await actionReaction(outgoingReaction, serviceInstance);
    //     // }
    //     return true;
    // }

    // return false;
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

        return res.status(200).json({});
    }]
};
