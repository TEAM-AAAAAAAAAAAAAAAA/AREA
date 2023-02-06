import { area } from "../area/.area";

export * from "./Discord";
export * from "./Teams";

@area.Service
export class prisma {
    @area.Reaction
    static sync(): void
    {
        // DO NOT TOUCH, LET THE MAGIC HAPPEN
    }
}
