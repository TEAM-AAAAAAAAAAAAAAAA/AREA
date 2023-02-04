export function MapPrismaService(target: Function)
{
    console.log("Mapped service: " + target.name)
}

export function MapPrismaReaction(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("Mapped Action: " + propertyKey)
}
