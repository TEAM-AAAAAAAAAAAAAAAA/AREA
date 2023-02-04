import { ustring } from "../types/ustring";
import { MapPrismaReaction, MapPrismaService } from "../utils/mappings";
import { IService } from "./IService";

@MapPrismaService
export class Discord implements IService {
    read(data: any): void {
        this._authorName = data.author;
        this._message = data.content;
    }

    @MapPrismaReaction
    sendMessage(): void {
        // push
    }

    _authorName: ustring;
    _message: ustring;
}
