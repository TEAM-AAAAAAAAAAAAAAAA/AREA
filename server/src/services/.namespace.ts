import { prisma } from '../config/db';
import { PrismaServices, PrismaActions } from "../area/mappings";

export * from "./Discord";
export * from "./Teams";

export class DB {
    static async sync() : Promise<boolean>
    {
        let isSynced: boolean = true;

        await PrismaServices.forEach(async (value, serviceName) => {
            await prisma.service.upsert({
                where: {
                    serviceName: serviceName
                },
                update: {
                    serviceName: serviceName
                },
                create: {
                    serviceName: serviceName
                }
            }).then((res) => {
                console.debug("Upserted Service: " + res.serviceName);
            }).catch((err) => {
                console.error("Failed to upsert Service: " + serviceName);
                isSynced = false;
            });

            await PrismaActions.forEach(async (value, key) => {
                let thisServiceName = key[0];
                let actionName = key[1];

                if (thisServiceName == serviceName) {
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
                    }).catch((err) => {
                        console.error("Failed to upsert Action: " + serviceName + '.' + actionName + " - " + err);
                        isSynced = false;
                    });
                }
            });
        });

        return isSynced;
    }
};
