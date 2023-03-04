import { prisma } from '../config/db';
import { PrismaServices, PrismaActions, Descriptions, ServiceAuthProviders } from "../area/mappings";

export * from "./Discord";
export * from "./TeamScript";
export * from "./OpenWeatherMap";
export * from "./Google";

async function insertActions(isSynced: boolean) : Promise<boolean> {
    for (let [key, action] of PrismaActions) {
    let thisServiceName = key.substring(0, key.indexOf('.'));
    let reactionName = key.substring(key.indexOf('.') + 1);
    let description = Descriptions.get(key);
    if (!description) {
        console.error("No description found for " + key);
    } else {
        await prisma.react.upsert({
            where: {
                serviceName_reactionName: {
                    serviceName: thisServiceName,
                    reactionName: reactionName
                }
            },
            update: {
                reactionName: reactionName,
                description: description,
                serviceName: thisServiceName
            },
            create: {
                reactionName: reactionName,
                description: description,
                serviceName: thisServiceName
            }}).then((res) => {
                console.debug("Upserted Action: " + res.serviceName + '.' + res.reactionName + ' - ' + res.description);
            }).catch((err) => {
                console.error("Failed to upsert Action: " + thisServiceName + '.' + description + '.' + reactionName + " - " + err);
                isSynced = false;
            });
        }
    }
    return isSynced;
}

async function insertServices(isSynced: boolean): Promise<boolean> {
    for (let [serviceName, service] of PrismaServices) {
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
    }
    return isSynced;
}

async function insertOAuthProviders(isSynced: boolean): Promise<boolean> {
    for (let [key, value] of ServiceAuthProviders) {
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

export class DB {
    static async sync() : Promise<boolean>
    {
        let isSynced: boolean = true;

        try {
            isSynced = await insertServices(isSynced);
            isSynced = await insertActions(isSynced);
            isSynced = await insertOAuthProviders(isSynced);
        } catch (err) {
            console.error(err);
            isSynced = false;
        }

        return isSynced;
    }
};
