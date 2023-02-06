import { prisma } from '../config/db';
import { PrismaServices, PrismaReactions } from "../area/mappings";

export * from "./Discord";
export * from "./Teams";

async function syncService(serviceName: string) : Promise<boolean> {
    var isSynced: boolean = false;

    await new Promise(r => setTimeout(r, 2000));

    await prisma.service.upsert({
        where: {
            serviceName: serviceName,
        },
        update: {
            serviceName: serviceName,
        },
        create: {
            serviceName: serviceName,
        }
    }).then((res) => {
        console.debug("Upserted Service: " + res.serviceName);
        isSynced = true;
    }).catch((err) => {
        console.error("Failed to upsert Service: " + serviceName);
        isSynced = false;
    });

    return isSynced;
}

async function syncAction(serviceName: string, actionName: string) : Promise<boolean> {
    var isSynced: boolean = false;

    await prisma.action.upsert({
        where: {
            serviceName_actionName: {
                serviceName: serviceName,
                actionName: actionName
            }
        },
        update: {
            actionName: actionName,
            serviceName: serviceName
        },
        create: {
            actionName: actionName,
            serviceName: serviceName
        }
    }).then((res) => {
        console.debug("Upserted Action: " + res.serviceName + '.' + res.actionName);
        isSynced = true;
    }).catch((err) => {
        console.error("Failed to upsert Action: " + serviceName + '.' + actionName + " - " + err);
        isSynced = false;
    });

    return isSynced;
}

export class DB {
    static async sync() : Promise<boolean>
    {
        await PrismaServices.forEach(async (value, key) => {
            if (!await syncService(key))
                return false;
        });

        await PrismaReactions.forEach(async (value, key) => {
            if (!await syncAction(key[0], key[1]))
                return false;
        });

        return true;
    }
};
