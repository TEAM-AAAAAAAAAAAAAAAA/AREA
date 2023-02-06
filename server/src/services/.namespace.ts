import { prisma } from '../config/db';
import { PrismaServices, PrismaReactions } from "../area/mappings";

export * from "./Discord";
export * from "./Teams";

async function syncServices() : Promise<boolean> {
    var isSynced: boolean = false;

    PrismaServices.forEach(element => {
        prisma.service.upsert({
            where: {
                name: element.name
            },
            update: {},
            create: {
                name: element.name
            }
        }).then((res) => {
            console.debug("Upserted Service: " + res.name);
            isSynced = true;
        }).catch((err) => {
            console.error("Failed to upsert Service: " + element.name);
            isSynced = false;
        });
    });
    return isSynced;
}

// async function syncActions() : Promise<boolean> {
//     var isSynced: boolean = false;

//     PrismaReactions.forEach(element => {
//         prisma.action.upsert({
//             where: {
//                 name: element.name,
//                 serviceId: 
//             },
//             update: {},
//             create: {
//                 // name: element.name
//             }
//         });
//     });
//     return isSynced;
// }

export class DB {
    static async sync() : Promise<boolean>
    {
        // PrismaReactions.forEach(element => {
        //     let serviceName = element.name.substring(0, element.name.indexOf("."));
        //     let actionName = element.name;
        //     console.log(element.name);
        //     prisma.service.upsert({
        //         where: {
        //             name: serviceName
        //         },
        //         update: {},
        //         create: {
        //             name: serviceName,
        //             Action: {
        //                 connectOrCreate: {
        //                     where: {
        //                         name: actionName
        //                     },
        //                     create: {
        //                         name: actionName
        //                     }
        //                 }
        //             }
        //             // actions: {
        //             //     create: {
        //             //         name: element.name.substring(element.name.indexOf(".") + 1)
        //             //     }
        //             // }
        //         }
        //     }).then((res) => {
        //         console.debug("Upserted Service: " + res.name);
        //     }).catch((err) => {
        //         console.error("Failed to upsert Service: " + err);
        //     });
        // });

        // if (!await syncServices())
        //     return false;
        // if (!await syncActions())
        //     return false;
        return true;
    }
};
