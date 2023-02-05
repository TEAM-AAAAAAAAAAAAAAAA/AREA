import { IService } from "../services/IService";

export function MapPrismaService(target: any)
{
    mapPrismaService.set(target.name, target.constructor);
    console.log("Mapped service: " + target.name)
}

export function MapPrismaReaction(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    mapPrismaReaction.set(target.constructor.name + '.' + propertyKey, target[propertyKey]);
    console.log("Mapped Action: " + target.constructor.name + '.' + propertyKey)
}

export var mapPrismaService: Map<string, new () => IService> = new Map<string, new () => IService>();
export var mapPrismaReaction: Map<string, new () => Function> = new Map<string, new () => Function>();
