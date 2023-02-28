import { Request, Response } from 'express';
import { prisma } from "../config/db";

export const aboutJson = {

    GET: [async (req: Request, res: Response) => {
        let services: any = await prisma.service.findMany().then((res: any) => {
            return res;
        });
        let actions: any = await prisma.action.findMany().then((res: any) => {
            return res;
        });
        let reactions: any = await prisma.reaction.findMany().then((res: any) => {
            return res;
        });
        let aboutServices: [any] = [{}];
        aboutServices.pop()
        for (let i = 0; i < services.length; i++) {
            let aboutActions: [any] = [{}];
            aboutActions.pop()
            let aboutReactions: [any] = [{}];
            aboutReactions.pop()
            for (let j = 0; j < actions.length; j++)
                if (actions[j].serviceName == services[i].serviceName)
                    aboutActions.push({
                        name: actions[j].actionName,
                        description: actions[j].description
                    })
            for (let j = 0; j < reactions.length; j++)
                if (reactions[j].serviceName == services[i].serviceName)
                    aboutReactions.push({
                        name: reactions[j].name,
                        description: reactions[j].description
                    })
            aboutServices.push({
                name: services[i].serviceName,
                actions: aboutReactions,
                reactions: aboutActions
            })
        }
        let about = {
            client: {
                host: req.headers.host,
            },
            server: {
                current_time: (Date.now() - Date.now() % 1000) / 1000,
                services: aboutServices
            }
        }

        res.status(200).json(about);
    }]
}
