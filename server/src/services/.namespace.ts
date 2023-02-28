import { prisma } from '../config/db';
import { PrismaServices, PrismaActions, Description, Descriptions } from "../area/mappings";

export * from "./Discord";
export * from "./Teams";
export * from "./OpenWeatherMap";

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
                let reactionName = key.substring(key.indexOf('.') + 1);
                let description = Descriptions.get(key);
                if (!description) {
                    console.error("No description found for " + key);
                } else {
                    if (thisServiceName == serviceName) {
                        await prisma.react.upsert({
                            where: {
                                serviceName_reactionName: {
                                    serviceName: serviceName,
                                    reactionName: reactionName
                                }
                            },
                            update: {
                                reactionName: reactionName,
                                description: description,
                                serviceName: serviceName
                            },
                            create: {
                                reactionName: reactionName,
                                description: description,
                                serviceName: serviceName
                            }
                        }).then((res) => {
                            console.debug("Upserted Action: " + res.serviceName + '.' + res.reactionName + ' - ' + res.description);
                        }).catch((err) => {
                            console.error("Failed to upsert Action: " + serviceName + '.' + description + '.' + reactionName + " - " + err);
                            isSynced = false;
                        });
                    }
                }
            });
        });

        return isSynced;
    }
};
