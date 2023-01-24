import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const newService = {

    GET: async (req: Request, res: Response) => {
        await prisma.actionReaction.findFirst(
            {include: {
                action: {
                    include: {
                        service: true,
                    }
                },
                reaction: {
                    include: {
                        // action: {
                        //     include: true
                        // }
                    }
                }
            }
        }).then(async (area: any) => {
            console.log(area)
        });
        res.status(200).send("ok")
    }
    
    // await prisma.service.create({
    //     data: {
    //         name: "teams"
    //     }
    // }).then(async (teams: any) => {
    //     await prisma.action.create({
    //         data: {
    //             serviceId: teams.id
    //         }
    //     }).then(async (teamsReact: any) => {
    //         await prisma.reaction.create({
    //             data: {
    //                 reactionId: teamsReact.id
    //             }
    //         }).then(async (action: any) => {
    //             await prisma.service.create({
    //                 data: {
    //                     name: "discord"
    //                 }
    //             }).then(async (discord: any) => {async (action: any) => {
    //                 await prisma.service.create({
    //                     data: {
    //                         name: "discord"
    //                     }
    //                 }).then(async (discord: any) => {
    //                     await prisma.action.create({
    //                         data: {
    //                             serviceId: discord.id
    //                         }
    //                     }).then(async (reaction: any) => {
    //                         await prisma.actionReaction.create({
    //                             data: {
    //                                 actionId: action.id,
    //                                 reactionId: reaction.id
    //                             }
    //                         })
    //                         // await prisma.action.create({
    //                         //     data: {
    //                         //         serviceId: discord.id
    //                         //     }
    //                         // }).then(async (reaction: any) => {
    //                         //     await prisma.actionReaction.create({
    //                         //         data: {
    //                         //             actionId: action.id,
    //                         //             reactionId: reaction.id
    //                         //         }
    //                         // });
    //                 });
    //             });
    //         });
    //     });
    // });
    // // await prisma.reaction.create({
    // //     data: {

    // //     }
    // // })
    // // await prisma.actionReaction.create({
    // //     data: {

    // //     }
    // // });
    // // await prisma.

};
