import { IService } from "../services/IService";

export function Service(target: any)
{
    PrismaServices.set(target.name, target);
    console.log("Mapped Service: " + target.name)
}

export function Reaction(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    PrismaActions.set([target.constructor.name, propertyKey], target[propertyKey]);
    console.log("Mapped Action: " + target.constructor.name + '.' + propertyKey)
}

export function Transcoder(incoming: string, outgoing: string) {
    console.log("Mapped Transcoder: " + incoming + ' to ' + outgoing)
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Transcoders.set(incoming + '.' + outgoing, target[propertyKey]);
    }
}

export var PrismaServices: Map<string, new () => IService> = new Map<string, new () => IService>();
export var PrismaActions: Map<[string, string], new () => Function> = new Map<[string, string], new () => Function>();
export var Transcoders: Map<string, new () => Function> = new Map<string, new () => Function>();
