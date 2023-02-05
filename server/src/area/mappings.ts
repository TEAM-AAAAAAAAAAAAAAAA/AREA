import { IService } from "../services/IService";

export function Service(target: any)
{
    mapPrismaServices.set(target.name, target);
    console.log("Mapped service: " + target.name)
}

export function Reaction(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    PrismaReactions.set(target.constructor.name + '.' + propertyKey, target[propertyKey]);
    console.log("Mapped Action: " + target.constructor.name + '.' + propertyKey)
}

export function Transcoder(incoming: string, outgoing: string) {
    console.log("Mapped Transcoder: " + incoming + ' to ' + outgoing)
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        mapTranscoders.set([incoming, outgoing], target[propertyKey]);
    }
}

export var mapPrismaServices: Map<string, new () => IService> = new Map<string, new () => IService>();
export var PrismaReactions: Map<string, new () => Function> = new Map<string, new () => Function>();
export var mapTranscoders: Map<[string, string], new () => Function> = new Map<[string, string], new () => Function>();
