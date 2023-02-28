import { prisma } from '../config/db';
import { PrismaServices, PrismaActions, Description, Descriptions } from "../area/mappings";

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
                console.error(err);
                isSynced = false;
            });

            await PrismaActions.forEach(async (value, key) => {
                let thisServiceName = key.substring(0, key.indexOf('.'));
                let actionName = key.substring(key.indexOf('.') + 1);
                let description = Descriptions.get(key);
                if (!description) {
                    console.error("No description found for " + key);
                } else {
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
                                description: description,
                                serviceName: serviceName
                            },
                            create: {
                                actionName: actionName,
                                description: description,
                                serviceName: serviceName
                            }
                        }).then((res) => {
                            console.debug("Upserted Action: " + res.serviceName + '.' + res.actionName + ' - ' + res.description);
                        }).catch((err) => {
                            console.error("Failed to upsert Action: " + serviceName + '.' + description + '.' + actionName + " - " + err);
                            isSynced = false;
                        });
                    }
                }
            });
        });

        return isSynced;
    }
};
