import { prisma } from '../config/db';
import { PrismaServices, PrismaActions, Descriptions, ServiceAuthProviders } from "../area/mappings";

export * from "./Discord";
export * from "./Teams";
export * from "./OpenWeatherMap";
export * from "./Google";

export class DB {
    static async sync() : Promise<boolean>
    {
        let isSynced: boolean = true;

        for (let [serviceName, service] of PrismaServices) {
        // await PrismaServices.forEach(async (value, serviceName) => {
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

            for (let [key, action] of PrismaActions) {
            // await PrismaActions.forEach(async (value, key) => {
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
            };
        };

        for (let [key, value] of ServiceAuthProviders) {
        // await ServiceAuthProviders.forEach(async (value, key) => {
            await prisma.oAuthProvider.upsert({
                where: {
                    serviceName: key
                },
                update: {
                    serviceName: key,
                    oAuthProviderName: value,
                    data: {}
                },
                create: {
                    serviceName: key,
                    oAuthProviderName: value,
                    data: {}
                }
            }).then((res) => {
                console.debug("Upserted OAuth Provider: " + res.serviceName + ' - ' + res.oAuthProviderName);
            }).catch((err) => {
                console.error("Failed to upsert OAuth Provider: " + key + ' - ' + err);
                isSynced = false;
            });
        };

        return isSynced;
    }
};
