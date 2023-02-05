import { MapPrismaReaction, MapPrismaService } from "../utils/mappings";

export * from "./Discord";
export * from "./Teams";

@MapPrismaService
export class MagicDoNotTouch {
    @MapPrismaReaction
    start(): void
    {
        // DO NOT TOUCH
    }
}
