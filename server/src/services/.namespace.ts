import { area } from "../area/.area";

export * from "./Discord";
export * from "./Teams";

@area.Service
export class MagicDoNotTouch {
    @area.Reaction
    start(): void
    {
        // DO NOT TOUCH
    }
}
